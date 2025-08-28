import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import type { TextAnnotation } from '../types/pdf'

export type ImageAnnotation = {
  pageIndex: number
  x: number
  y: number
  width?: number
  height?: number
  bytes: Uint8Array
  mime: 'image/png' | 'image/jpeg'
}

export async function fileToBytes(file: File): Promise<Uint8Array> {
  const ab = await file.arrayBuffer()
  return new Uint8Array(ab)
}

export async function mergePdfs(files: (File | Uint8Array)[]): Promise<Uint8Array> {
  const out = await PDFDocument.create()
  for (const item of files) {
    const bytes = item instanceof Uint8Array ? item : await fileToBytes(item)
    const src = await PDFDocument.load(bytes, { ignoreEncryption: true })
    const pages = await out.copyPages(src, src.getPageIndices())
    pages.forEach(p => out.addPage(p))
  }
  return await out.save()
}

export async function reorderPages(pdfBytes: Uint8Array, order: number[]): Promise<Uint8Array> {
  const src = await PDFDocument.load(pdfBytes, { ignoreEncryption: true })
  const out = await PDFDocument.create()
  const pages = await out.copyPages(src, order)
  pages.forEach(p => out.addPage(p))
  return await out.save()
}

export async function addTextAnnotations(pdfBytes: Uint8Array, annotations: TextAnnotation[]): Promise<Uint8Array> {
  if (annotations.length === 0) return pdfBytes
  const doc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true })

  // Load fonts for different styles
  const helvetica = await doc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold)
  const helveticaOblique = await doc.embedFont(StandardFonts.HelveticaOblique)
  const helveticaBoldOblique = await doc.embedFont(StandardFonts.HelveticaBoldOblique)

  for (const ann of annotations) {
    // Skip if required fields are missing
    if (ann.x === undefined || ann.y === undefined || ann.text === undefined || ann.style === undefined) {
      console.warn('Skipping annotation with missing required fields', ann)
      continue
    }

    try {
      // PDF-lib uses 0-based page indices; our ann.pageNumber is 1-based in the app
      const pageIndex = (ann.pageNumber || 1) - 1
      const page = doc.getPage(pageIndex)
      const { r, g, b } = hexToRgb(ann.style.color || '#000000')
      const formats = new Set(ann.formats || [])
      const fontSize = ann.style.fontSize || 12

      // Choose font
      let font = helvetica
      if (formats.has('bold') && formats.has('italic')) {
        font = helveticaBoldOblique
      } else if (formats.has('bold')) {
        font = helveticaBold
      } else if (formats.has('italic')) {
        font = helveticaOblique
      }

      // Underline (drawn manually)
      if (formats.has('underline')) {
        const textWidth = font.widthOfTextAtSize(ann.text, fontSize)
        // approximate underline y offset slightly below text baseline
        const underlineY = ann.y - (fontSize * 0.12)
        page.drawLine({
          start: { x: ann.x, y: underlineY },
          end: { x: ann.x + textWidth, y: underlineY },
          thickness: Math.max(0.5, fontSize * 0.06),
          color: rgb(r, g, b)
        })
      }

      // Draw the text (x,y are PDF points; origin bottom-left)
      page.drawText(ann.text, {
        x: ann.x,
        y: ann.y,
        size: fontSize,
        font,
        color: rgb(r, g, b)
      })
    } catch (error) {
      console.error('Error adding text annotation:', error, ann)
    }
  }
  return await doc.save()
}

export async function addPngImage(
  pdfBytes: Uint8Array,
  pageIndex: number,
  pngBytes: Uint8Array,
  x: number,
  y: number,
  width?: number,
  height?: number,
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true })
  const page = doc.getPage(pageIndex)
  const img = await doc.embedPng(pngBytes)
  const dims = img.scale(1)
  const w = width ?? dims.width
  const h = height ?? dims.height
  page.drawImage(img, { x, y, width: w, height: h })
  return await doc.save()
}

export async function addImageAnnotations(pdfBytes: Uint8Array, annotations: ImageAnnotation[]): Promise<Uint8Array> {
  if (annotations.length === 0) return pdfBytes
  const doc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true })
  for (const ann of annotations) {
    const page = doc.getPage(ann.pageIndex)
    const img = ann.mime === 'image/png' ? await doc.embedPng(ann.bytes) : await doc.embedJpg(ann.bytes)
    const dims = img.scale(1)
    const w = ann.width ?? dims.width
    const h = ann.height ?? dims.height
    page.drawImage(img, { x: ann.x, y: ann.y, width: w, height: h })
  }
  return await doc.save()
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#','')
  const bigint = parseInt(clean.length === 3 ? clean.split('').map(c=>c+c).join('') : clean, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return { r: r/255, g: g/255, b: b/255 }
}
