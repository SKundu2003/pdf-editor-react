/**
 * DOCX Service for PDF-to-DOCX conversion and document processing
 */

import type { DocxFile, DocxConversionProgress, DocxApiResponse } from '../types/docx'

class DocxService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
  }

  /**
   * Convert PDF to DOCX using backend API
   */
  async convertPdfToDocx(
    pdfFile: File,
    onProgress?: (progress: DocxConversionProgress) => void
  ): Promise<Blob> {
    try {
      onProgress?.({ 
        stage: 'uploading', 
        progress: 0, 
        message: 'Preparing PDF for conversion...' 
      })

      // Validate file
      if (!pdfFile.type.includes('pdf')) {
        throw new Error('Invalid file type. Please upload a PDF file.')
      }

      if (pdfFile.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('File size too large. Maximum size is 10MB.')
      }

      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', pdfFile)

      onProgress?.({ 
        stage: 'uploading', 
        progress: 25, 
        message: 'Uploading PDF to conversion service...' 
      })

      // Set up request with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout

      let response: Response
      try {
        response = await fetch(`${this.baseUrl}/api/pdf/to-docx`, {
          method: 'POST',
          body: formData,
          mode: 'cors',
          headers: {
            'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/json',
          },
          signal: controller.signal
        })
        clearTimeout(timeoutId)
      } catch (fetchError) {
        clearTimeout(timeoutId)
        
        if (fetchError instanceof Error) {
          if (fetchError.name === 'AbortError') {
            throw new Error(`Conversion timeout: The service did not respond within 60 seconds. Please try with a smaller file or check your connection.`)
          }
          
          if (fetchError.message.includes('Failed to fetch')) {
            throw new Error(`Cannot connect to conversion service at ${this.baseUrl}. Please ensure:\n\n1. The backend service is running\n2. The URL is correct\n3. CORS is properly configured\n4. No firewall is blocking the connection`)
          }
        }
        
        throw fetchError
      }

      onProgress?.({ 
        stage: 'converting', 
        progress: 50, 
        message: 'Converting PDF to DOCX format...' 
      })

      if (!response.ok) {
        let errorMessage = `Conversion failed (${response.status}): ${response.statusText}`
        
        try {
          const errorText = await response.text()
          if (errorText) {
            errorMessage += `\n\nDetails: ${errorText}`
          }
        } catch (e) {
          // Ignore error text parsing issues
        }

        if (response.status === 404) {
          throw new Error(`Conversion endpoint not found. Please verify the backend service is running at ${this.baseUrl}`)
        } else if (response.status === 413) {
          throw new Error(`File too large: The PDF exceeds the server's size limit.`)
        } else if (response.status === 422) {
          throw new Error(`Invalid PDF file: The file may be corrupted or password-protected.`)
        } else if (response.status >= 500) {
          throw new Error(`Server error: ${errorMessage}`)
        }
        
        throw new Error(errorMessage)
      }

      onProgress?.({ 
        stage: 'processing', 
        progress: 75, 
        message: 'Processing DOCX file...' 
      })

      // Get DOCX blob from response
      const docxBlob = await response.blob()
      
      // Validate the response is actually a DOCX file
      if (!docxBlob.type.includes('officedocument') && !docxBlob.type.includes('octet-stream')) {
        console.warn('Unexpected MIME type:', docxBlob.type)
      }

      if (docxBlob.size === 0) {
        throw new Error('Received empty DOCX file from conversion service')
      }

      onProgress?.({ 
        stage: 'complete', 
        progress: 100, 
        message: 'Conversion completed successfully!' 
      })

      return docxBlob
    } catch (error) {
      console.error('PDF to DOCX conversion failed:', error)
      throw error
    }
  }

  /**
   * Extract text content from DOCX for editing
   */
  async extractDocxContent(docxBlob: Blob): Promise<{ html: string; rawText: string }> {
    try {
      const mammoth = await import('mammoth')
      const arrayBuffer = await docxBlob.arrayBuffer()
      
      // Convert DOCX to HTML for editing
      const htmlResult = await mammoth.convertToHtml({ arrayBuffer })
      
      // Extract plain text as fallback
      const textResult = await mammoth.extractRawText({ arrayBuffer })
      
      if (htmlResult.messages.length > 0) {
        console.warn('DOCX conversion warnings:', htmlResult.messages)
      }

      return {
        html: htmlResult.value || '',
        rawText: textResult.value || ''
      }
    } catch (error) {
      console.error('Failed to extract DOCX content:', error)
      throw new Error('Failed to process DOCX file for editing')
    }
  }

  /**
   * Create DOCX from HTML content
   */
  async createDocxFromHtml(htmlContent: string, originalFileName: string): Promise<Blob> {
    try {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import('docx')
      
      // Parse HTML and convert to DOCX structure
      const docxElements = this.parseHtmlToDocxElements(htmlContent)
      
      // Create new document
      const doc = new Document({
        sections: [{
          properties: {},
          children: docxElements
        }]
      })

      // Generate DOCX blob
      const buffer = await Packer.toBlob(doc)
      return buffer
    } catch (error) {
      console.error('Failed to create DOCX from HTML:', error)
      throw new Error('Failed to generate DOCX file from edited content')
    }
  }

  /**
   * Parse HTML content to DOCX elements
   */
  private parseHtmlToDocxElements(htmlContent: string): any[] {
    const { Paragraph, TextRun, HeadingLevel } = require('docx')
    const elements: any[] = []
    
    // Create temporary DOM element to parse HTML
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlContent
    
    // Process each child element
    const processElement = (element: Element): any[] => {
      const tagName = element.tagName?.toLowerCase()
      const text = element.textContent?.trim() || ''
      
      if (!text) return []
      
      switch (tagName) {
        case 'h1':
          return [new Paragraph({
            text: text,
            heading: HeadingLevel.HEADING_1
          })]
        
        case 'h2':
          return [new Paragraph({
            text: text,
            heading: HeadingLevel.HEADING_2
          })]
        
        case 'h3':
          return [new Paragraph({
            text: text,
            heading: HeadingLevel.HEADING_3
          })]
        
        case 'p':
          return [new Paragraph({
            children: [new TextRun(text)]
          })]
        
        case 'strong':
        case 'b':
          return [new Paragraph({
            children: [new TextRun({ text, bold: true })]
          })]
        
        case 'em':
        case 'i':
          return [new Paragraph({
            children: [new TextRun({ text, italics: true })]
          })]
        
        default:
          return [new Paragraph({
            children: [new TextRun(text)]
          })]
      }
    }
    
    // Process all elements
    Array.from(tempDiv.children).forEach(element => {
      elements.push(...processElement(element))
    })
    
    // Fallback if no elements processed
    if (elements.length === 0 && htmlContent.trim()) {
      elements.push(new Paragraph({
        children: [new TextRun(htmlContent.replace(/<[^>]*>/g, ''))]
      }))
    }
    
    return elements
  }

  /**
   * Download DOCX file
   */
  downloadDocx(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename.endsWith('.docx') ? filename : `${filename}.docx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

// Singleton instance
let docxService: DocxService | null = null

export function initializeDocxService(): DocxService {
  const baseUrl = 'https://medicine-consequences-display-seek.trycloudflare.com'
  
  if (!docxService) {
    docxService = new DocxService(baseUrl)
  }
  return docxService
}

export function getDocxService(): DocxService {
  if (!docxService) {
    return initializeDocxService()
  }
  return docxService
}