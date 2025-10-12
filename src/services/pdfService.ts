import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import type { TextAnnotation, EditedText } from '../types/pdf'

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

export async function editTextInPdf(pdfBytes: Uint8Array, edit: EditedText): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true })
  const page = doc.getPage(edit.pageNumber - 1)

  // Get page dimensions
  const { width, height } = page.getSize()

  // Load a font
  const helvetica = await doc.embedFont(StandardFonts.Helvetica)

  // Calculate approximate text dimensions for better positioning
  const fontSize = Math.min(edit.height * 0.8, 24) // Reasonable font size
  const textWidth = helvetica.widthOfTextAtSize(edit.newText, fontSize)

  // Ensure text doesn't overflow page boundaries
  const adjustedX = Math.max(0, Math.min(edit.x, width - textWidth))
  const adjustedY = Math.max(0, Math.min(edit.y, height - fontSize))

  // Cover the old text area with a white rectangle (slightly larger for better coverage)
  const eraseWidth = Math.max(edit.width, textWidth + 10)
  const eraseHeight = Math.max(edit.height, fontSize + 5)

  page.drawRectangle({
    x: adjustedX - 5,
    y: adjustedY - 2,
    width: eraseWidth,
    height: eraseHeight,
    color: rgb(1, 1, 1),
    opacity: 1,
  })

  // Draw the new text with better positioning and sizing
  page.drawText(edit.newText, {
    x: adjustedX,
    y: adjustedY,
    size: fontSize,
    font: helvetica,
    color: rgb(0, 0, 0),
  })

  return await doc.save()
}

export async function editExistingTextInPdf(
  pdfBytes: Uint8Array,
  pageNumber: number,
  originalText: string,
  newText: string,
  x: number,
  y: number
): Promise<Uint8Array> {
  // This is a more sophisticated approach that tries to find and replace text
  // Note: PDF text replacement is complex due to the nature of PDF text objects
  // For now, we'll use the overlay approach but with better precision

  const doc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true })
  const page = doc.getPage(pageNumber - 1)

  // Get page dimensions
  const { width, height } = page.getSize()

  // Load font
  const helvetica = await doc.embedFont(StandardFonts.Helvetica)

  // Estimate text dimensions for better overlay
  const estimatedFontSize = 12 // Default assumption
  const estimatedWidth = helvetica.widthOfTextAtSize(originalText, estimatedFontSize)
  const estimatedHeight = estimatedFontSize * 1.2

  // Create a more precise overlay rectangle
  const overlayX = x - 2
  const overlayY = y - 2
  const overlayWidth = Math.max(estimatedWidth + 4, 50) // Minimum width
  const overlayHeight = estimatedHeight + 4

  // Ensure overlay doesn't go outside page bounds
  const safeX = Math.max(0, Math.min(overlayX, width - overlayWidth))
  const safeY = Math.max(0, Math.min(overlayY, height - overlayHeight))

  // Draw white overlay to erase original text
  page.drawRectangle({
    x: safeX,
    y: safeY,
    width: overlayWidth,
    height: overlayHeight,
    color: rgb(1, 1, 1),
    opacity: 1,
  })

  // Calculate proper font size based on available space
  const maxFontSize = Math.min(overlayHeight - 4, 24)
  const calculatedFontSize = Math.min(maxFontSize, 12) // Start with reasonable size
  const newTextWidth = helvetica.widthOfTextAtSize(newText, calculatedFontSize)

  // Adjust font size if text is too wide
  let finalFontSize = calculatedFontSize
  if (newTextWidth > overlayWidth - 4) {
    finalFontSize = Math.max(6, (overlayWidth - 4) * calculatedFontSize / newTextWidth)
  }

  // Position text within the overlay area
  const textX = safeX + 2
  const textY = safeY + 2

  // Draw the new text
  page.drawText(newText, {
    x: textX,
    y: textY,
    size: finalFontSize,
    font: helvetica,
    color: rgb(0, 0, 0),
  })

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
