/**
 * Custom PDF Services API integration for PDF ↔ HTML conversion
 * Handles file upload, conversion, and download using custom API endpoint
 */

import type { PDFFile, ConvertedContent, APIProgress } from '../types/editor'

// Custom PDF Services API integration
class CustomPDFServices {
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
      
      // Call custom API endpoint
      const response = await fetch(`${this.baseUrl}/api/pdf/to-html`, {
        method: 'POST',
        body: formData,
        mode: 'cors',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        throw new Error(`API Error: ${response.status} - ${response.statusText}`)
      }

      onProgress?.({ stage: 'converting', progress: 50, message: 'Processing document...' })
      
      // Get HTML content from response
      const htmlContent = await response.text()
      console.log('API Response HTML:', htmlContent.substring(0, 200) + '...')

      onProgress?.({ stage: 'converting', progress: 100, message: 'Conversion complete!' })

      return {
        html: htmlContent,
        originalStructure: {
          pages: 1,
          fonts: ['Arial', 'Times New Roman', 'Helvetica', 'Georgia'],
          colors: ['#000000', '#333333', '#666666', '#2563eb'],
          layout: 'single-column'
        },
        fonts: ['Arial', 'Times New Roman', 'Helvetica', 'Georgia'],
        styles: ['body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }']
      }
    } catch (error) {
      console.error('PDF to HTML conversion failed:', error)
      
      // Provide more specific error messages
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error(`Cannot connect to PDF API at ${this.baseUrl}. Please check if the API server is running and accessible.`)
      }

      throw error
    }
  }

  /**
   * Convert edited HTML back to PDF
   */
  async convertHtmlToPdf(
    html: string,
    originalStructure: any,
    onProgress?: (progress: APIProgress) => void
  ): Promise<Uint8Array> {
    try {
      onProgress?.({ stage: 'processing', progress: 0, message: 'Preparing content...' })
      
      // For now, use fallback PDF generation since we only have PDF to HTML endpoint
      // In the future, you can add an HTML to PDF endpoint to your API
      onProgress?.({ stage: 'processing', progress: 50, message: 'Using fallback generator...' })

      const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib')
      
      const pdfDoc = await PDFDocument.create()
      const page = pdfDoc.addPage([612, 792]) // Letter size
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      
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
      
      // Fallback to pdf-lib generation
      onProgress?.({ stage: 'processing', progress: 50, message: 'Using fallback generator...' })

      const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib')
      
      const pdfDoc = await PDFDocument.create()
      const page = pdfDoc.addPage([612, 792]) // Letter size
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      
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
    }
  }

  /**
   * Convert edited HTML back to PDF (Alternative implementation)
   */
  async convertHtmlToPdfAlternative(
    html: string,
    originalStructure: any,
    onProgress?: (progress: APIProgress) => void
  ): Promise<Uint8Array> {
    try {
      onProgress?.({ stage: 'processing', progress: 0, message: 'Preparing content...' })
      
      // Create FormData for HTML content
      const formData = new FormData()
      const htmlBlob = new Blob([html], { type: 'text/html' })
      formData.append('file', htmlBlob, 'content.html')
      
      // Call custom API endpoint (if you add HTML to PDF endpoint)
      const response = await fetch(`${this.baseUrl}/api/html/to-pdf`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`HTML to PDF conversion failed: ${response.statusText}`)
      }

      onProgress?.({ stage: 'downloading', progress: 100, message: 'Download ready!' })
      const pdfArrayBuffer = await response.arrayBuffer()
      
      return new Uint8Array(pdfArrayBuffer)
    } catch (error) {
      console.error('HTML to PDF conversion failed:', error)
      
      // Fallback to pdf-lib generation
      onProgress?.({ stage: 'processing', progress: 50, message: 'Using fallback generator...' })

      const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib')
      
      const pdfDoc = await PDFDocument.create()
      const page = pdfDoc.addPage([612, 792]) // Letter size
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      
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
    }
  }

  /**
   * Merge multiple PDFs into one
   */
  async mergePdfs(
    files: File[],
    onProgress?: (progress: APIProgress) => void
  ): Promise<Uint8Array> {
    try {
      onProgress?.({ stage: 'uploading', progress: 0, message: 'Uploading files...' })
      
      // Upload all files
      const assetIds: string[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const uploadResponse = await fetch(`${this.baseUrl}/assets`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'x-api-key': this.clientId,
            'Content-Type': 'application/pdf'
          },
          body: file
        })

        if (!uploadResponse.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }

        const { assetID } = await uploadResponse.json()
        assetIds.push(assetID)
        
        const progress = ((i + 1) / files.length) * 50
        onProgress?.({ stage: 'uploading', progress, message: `Uploaded ${i + 1}/${files.length} files` })
      }

      onProgress?.({ stage: 'processing', progress: 50, message: 'Merging PDFs...' })

      // Create merge job
      const jobResponse = await fetch(`${this.baseUrl}/operation/combinepdf`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          assets: assetIds.map(id => ({ assetID: id }))
        })
      })

      if (!jobResponse.ok) {
        throw new Error(`Merge job failed: ${jobResponse.statusText}`)
      }

      const { location } = await jobResponse.json()
      
      // Poll for completion
      let result
      let attempts = 0
      const maxAttempts = 30
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const statusResponse = await fetch(location, {
          headers: this.getHeaders()
        })
        
        result = await statusResponse.json()
        
        if (result.status === 'done') {
          break
        } else if (result.status === 'failed') {
          throw new Error('Merge operation failed')
        }
        
        attempts++
        const progress = 50 + Math.min((attempts / maxAttempts) * 40, 40)
        onProgress?.({ stage: 'processing', progress, message: 'Merging PDFs...' })
      }

      if (!result || result.status !== 'done') {
        throw new Error('Merge operation timeout')
      }

      // Download merged PDF
      onProgress?.({ stage: 'downloading', progress: 100, message: 'Download ready!' })
      const downloadResponse = await fetch(result.asset.downloadUri)
      const pdfArrayBuffer = await downloadResponse.arrayBuffer()
      
      return new Uint8Array(pdfArrayBuffer)
    } catch (error) {
      console.error('PDF merge failed:', error)
      
      // Fallback to pdf-lib merge
      return this.fallbackMergePdfs(files, onProgress)
    }
  }

  private async fallbackMergePdfs(
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
let customService: CustomPDFServices | null = null

export function initializeCustomAPI(): CustomPDFServices {
  const baseUrl = import.meta.env.VITE_PDF_API_BASE_URL || 'https://slot-johnson-bend-internship.trycloudflare.com'
  
  if (!baseUrl) {
    throw new Error('PDF API base URL not found in environment variables')
  }
  
  if (!customService) {
    customService = new CustomPDFServices(baseUrl)
  }
  return customService
}

export function getCustomAPI(): CustomPDFServices {
  if (!customService) {
    return initializeCustomAPI()
  }
  return customService
}

/**
 * Check if Custom API is configured
 */
export function isCustomAPIConfigured(): boolean {
  // Always return true since we have a default URL
  return true
}

// Legacy exports for backward compatibility
export const initializeAdobeAPI = initializeCustomAPI
export const getAdobeAPI = getCustomAPI
export const isAdobeAPIConfigured = isCustomAPIConfigured

/**
 * Extract text content from PDF for preview
 */
export async function extractPdfText(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    
    // Use pdf-lib to extract basic text information
    const { PDFDocument } = await import('pdf-lib')
    const pdfDoc = await PDFDocument.load(uint8Array, { ignoreEncryption: true })
    
    // For now, return basic info - in production, use proper text extraction
    return `Document loaded successfully.\nPages: ${pdfDoc.getPageCount()}\nReady for editing.`
  } catch (error) {
    console.error('Text extraction failed:', error)
    return 'Unable to extract text preview.'
  }
}