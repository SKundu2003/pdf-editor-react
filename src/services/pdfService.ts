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
  const font = await doc.embedFont(StandardFonts.Helvetica)

  for (const ann of annotations) {
    const page = doc.getPage(ann.pageIndex)
    const { r, g, b } = hexToRgb(ann.style.color)
    page.drawText(ann.text, {
      x: ann.x,
      y: ann.y,
      size: ann.style.fontSize,
      color: rgb(r, g, b),
      font,
    })
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
