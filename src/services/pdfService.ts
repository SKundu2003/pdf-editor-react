/**
 * Simple PDF Services for PDF ↔ HTML conversion
 * Handles file upload and conversion using custom backend API
 */

import type { ConvertedContent, APIProgress } from '../types/editor'

class PDFService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '') // Remove trailing slash
  }

  /**
   * Convert PDF to HTML for editing
   */
  async convertPdfToHtml(
    pdfFile: File,
    onProgress?: (progress: APIProgress) => void
  ): Promise<ConvertedContent> {
    try {
      onProgress?.({ stage: 'uploading', progress: 0, message: 'Uploading PDF...' })
      
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', pdfFile)
      
      onProgress?.({ stage: 'converting', progress: 25, message: 'Sending to server...' })
      
      // Call backend API endpoint
      const response = await fetch(`${this.baseUrl}/api/pdf/to-html`, {
        method: 'POST',
        body: formData,
        mode: 'cors'
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        throw new Error(`API Error: ${response.status} - ${response.statusText}`)
      }

      onProgress?.({ stage: 'converting', progress: 75, message: 'Processing response...' })
      
      // Get HTML content from response
      const htmlContent = await response.text()
      console.log('API Response HTML received:', htmlContent.substring(0, 200) + '...')

      onProgress?.({ stage: 'converting', progress: 100, message: 'Conversion complete!' })

      return {
        html: htmlContent,
        originalStructure: {
          pages: 1,
          fonts: ['Arial', 'Times New Roman', 'Helvetica'],
          colors: ['#000000', '#333333', '#666666'],
          layout: 'single-column'
        },
        fonts: ['Arial', 'Times New Roman', 'Helvetica'],
        styles: ['body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }']
      }
    } catch (error) {
      console.error('PDF to HTML conversion failed:', error)
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error(`Cannot connect to backend API at ${this.baseUrl}. Please check if the server is running.`)
      }

      throw error
    }
  }

  /**
   * Convert edited HTML back to PDF using pdf-lib
   */
  async convertHtmlToPdf(
    html: string,
    originalStructure: any,
    onProgress?: (progress: APIProgress) => void
  ): Promise<Uint8Array> {
    try {
      onProgress?.({ stage: 'processing', progress: 0, message: 'Preparing content...' })

      const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib')
      
      const pdfDoc = await PDFDocument.create()
      const page = pdfDoc.addPage([612, 792]) // Letter size
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      
      onProgress?.({ stage: 'processing', progress: 50, message: 'Generating PDF...' })
      
      // Extract text from HTML (simplified)
      const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
      const lines = this.wrapText(textContent, 500, font, 12)
      
      let yPosition = 750
      for (const line of lines) {
        if (yPosition < 50) break // Prevent overflow
        page.drawText(line, {
          x: 50,
          y: yPosition,
          size: 12,
          font,
          color: rgb(0, 0, 0)
        })
        yPosition -= 20
      }

      onProgress?.({ stage: 'downloading', progress: 100, message: 'Download ready!' })
      return await pdfDoc.save()
    } catch (error) {
      console.error('HTML to PDF conversion failed:', error)
      throw error
    }
  }

  /**
   * Merge multiple PDFs into one using pdf-lib
   */
  async mergePdfs(
    files: File[],
    onProgress?: (progress: APIProgress) => void
  ): Promise<Uint8Array> {
    const { PDFDocument } = await import('pdf-lib')
    const mergedPdf = await PDFDocument.create()

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
      
      pages.forEach(page => mergedPdf.addPage(page))
      
      const progress = ((i + 1) / files.length) * 100
      onProgress?.({ stage: 'processing', progress, message: `Merging ${i + 1}/${files.length} files` })
    }

    return await mergedPdf.save()
  }

  private wrapText(text: string, maxWidth: number, font: any, fontSize: number): string[] {
    const words = text.split(' ')
    const lines: string[] = []
    let currentLine = ''

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      const width = font.widthOfTextAtSize(testLine, fontSize)
      
      if (width <= maxWidth) {
        currentLine = testLine
      } else {
        if (currentLine) {
          lines.push(currentLine)
          currentLine = word
        } else {
          lines.push(word)
        }
      }
    }
    
    if (currentLine) {
      lines.push(currentLine)
    }
    
    return lines
  }
}

// Singleton instance
let pdfService: PDFService | null = null

export function initializePDFService(): PDFService {
  const baseUrl = import.meta.env.VITE_PDF_API_BASE_URL || 'https://slot-johnson-bend-internship.trycloudflare.com'
  
  if (!baseUrl) {
    throw new Error('PDF API base URL not found in environment variables')
  }
  
  if (!pdfService) {
    pdfService = new PDFService(baseUrl)
  }
  return pdfService
}

export function getPDFService(): PDFService {
  if (!pdfService) {
    return initializePDFService()
  }
  return pdfService
}

export function isPDFServiceConfigured(): boolean {
  return true // Always configured since we have a default URL
}