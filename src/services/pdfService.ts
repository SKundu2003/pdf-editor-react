/**
 * Enhanced PDF Services for PDF ↔ HTML conversion
 * Handles file upload, conversion, and proper PDF generation
 */

import type { ConvertedContent, APIProgress } from '../types/editor'

class PDFService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '') // Remove trailing slash
  }

  /**
   * Convert PDF to HTML for editing with proper text extraction
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
      
      // Call backend API endpoint with proper headers
      const response = await fetch(`${this.baseUrl}/api/pdf/to-html`, {
        method: 'POST',
        body: formData,
        mode: 'cors',
        headers: {
          'Accept': 'text/html,application/json',
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        throw new Error(`API Error: ${response.status} - ${response.statusText}`)
      }

      onProgress?.({ stage: 'converting', progress: 75, message: 'Processing response...' })
      
      // Get HTML content from response
      const htmlContent = await response.text()
      console.log('API Response HTML received:', htmlContent.substring(0, 500) + '...')

      // Enhanced content processing
      const processedContent = this.processHtmlContent(htmlContent)

      onProgress?.({ stage: 'converting', progress: 100, message: 'Conversion complete!' })

      return {
        html: processedContent.html,
        originalStructure: processedContent.structure,
        fonts: processedContent.fonts,
        styles: processedContent.styles
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
   * Process and enhance HTML content from API
   */
  private processHtmlContent(htmlContent: string) {
    // Create a temporary container to parse HTML
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlContent

    // Extract and preserve fonts
    const fonts = this.extractFonts(tempDiv)
    
    // Extract and enhance styles
    const styles = this.extractAndEnhanceStyles(tempDiv)
    
    // Clean and enhance HTML structure
    const cleanedHtml = this.enhanceHtmlStructure(tempDiv)
    
    // Analyze document structure
    const structure = this.analyzeDocumentStructure(tempDiv)

    return {
      html: cleanedHtml,
      structure,
      fonts,
      styles
    }
  }

  /**
   * Extract fonts from HTML content
   */
  private extractFonts(container: HTMLElement): string[] {
    const fonts = new Set<string>()
    
    // Default web-safe fonts
    fonts.add('Arial, sans-serif')
    fonts.add('Times New Roman, serif')
    fonts.add('Helvetica, sans-serif')
    fonts.add('Georgia, serif')
    fonts.add('Verdana, sans-serif')
    
    // Extract fonts from inline styles
    const elementsWithStyle = container.querySelectorAll('[style*="font-family"]')
    elementsWithStyle.forEach(el => {
      const style = el.getAttribute('style') || ''
      const fontMatch = style.match(/font-family:\s*([^;]+)/i)
      if (fontMatch) {
        fonts.add(fontMatch[1].trim())
      }
    })

    return Array.from(fonts)
  }

  /**
   * Extract and enhance CSS styles
   */
  private extractAndEnhanceStyles(container: HTMLElement): string[] {
    const styles = [
      // Base styles for proper text rendering
      `body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
        line-height: 1.6; 
        margin: 0; 
        padding: 20px; 
        color: #1a1a1a;
        background: white;
      }`,
      
      // Typography styles
      `h1, h2, h3, h4, h5, h6 { 
        font-weight: 600; 
        margin: 1.5em 0 0.5em 0; 
        line-height: 1.3;
        color: #1a1a1a;
      }`,
      
      `h1 { font-size: 2em; }`,
      `h2 { font-size: 1.5em; }`,
      `h3 { font-size: 1.25em; }`,
      
      // Paragraph styles
      `p { 
        margin: 0.75em 0; 
        text-align: justify;
        hyphens: auto;
      }`,
      
      // List styles
      `ul, ol { 
        margin: 1em 0; 
        padding-left: 2em; 
      }`,
      
      `li { 
        margin: 0.25em 0; 
        line-height: 1.5;
      }`,
      
      // Table styles for better formatting
      `table { 
        border-collapse: collapse; 
        width: 100%; 
        margin: 1em 0;
        border: 1px solid #ddd;
      }`,
      
      `th, td { 
        border: 1px solid #ddd; 
        padding: 8px 12px; 
        text-align: left;
        vertical-align: top;
      }`,
      
      `th { 
        background-color: #f5f5f5; 
        font-weight: 600;
      }`,
      
      // Preserve spacing and formatting
      `.preserve-spacing { white-space: pre-wrap; }`,
      `.text-center { text-align: center; }`,
      `.text-right { text-align: right; }`,
      `.font-bold { font-weight: 600; }`,
      `.font-italic { font-style: italic; }`,
    ]

    return styles
  }

  /**
   * Enhance HTML structure for better editing
   */
  private enhanceHtmlStructure(container: HTMLElement): string {
    // Remove dangerous elements
    const dangerousElements = container.querySelectorAll('script, style, meta, link, iframe, object, embed')
    dangerousElements.forEach(el => el.remove())

    // Enhance text nodes and preserve formatting
    this.enhanceTextNodes(container)
    
    // Fix common formatting issues
    this.fixFormattingIssues(container)
    
    // Ensure proper paragraph structure
    this.ensureParagraphStructure(container)

    return container.innerHTML
  }

  /**
   * Enhance text nodes for better editing
   */
  private enhanceTextNodes(container: HTMLElement) {
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      null
    )

    const textNodes: Text[] = []
    let node: Node | null
    while (node = walker.nextNode()) {
      textNodes.push(node as Text)
    }

    textNodes.forEach(textNode => {
      const text = textNode.textContent || ''
      
      // Skip empty or whitespace-only nodes
      if (!text.trim()) return
      
      // Preserve important whitespace
      if (text.includes('\n') || text.includes('\t')) {
        const span = document.createElement('span')
        span.className = 'preserve-spacing'
        span.textContent = text
        textNode.parentNode?.replaceChild(span, textNode)
      }
    })
  }

  /**
   * Fix common formatting issues
   */
  private fixFormattingIssues(container: HTMLElement) {
    // Convert div elements to paragraphs where appropriate
    const divs = container.querySelectorAll('div')
    divs.forEach(div => {
      if (div.children.length === 0 && div.textContent?.trim()) {
        const p = document.createElement('p')
        p.innerHTML = div.innerHTML
        div.parentNode?.replaceChild(p, div)
      }
    })

    // Ensure proper line breaks
    const brs = container.querySelectorAll('br')
    brs.forEach(br => {
      // Convert multiple <br> tags to paragraph breaks
      let nextSibling = br.nextSibling
      if (nextSibling && nextSibling.nodeName === 'BR') {
        const p = document.createElement('p')
        p.innerHTML = '&nbsp;'
        br.parentNode?.replaceChild(p, br)
        if (nextSibling.parentNode) {
          nextSibling.parentNode.removeChild(nextSibling)
        }
      }
    })
  }

  /**
   * Ensure proper paragraph structure
   */
  private ensureParagraphStructure(container: HTMLElement) {
    // Wrap orphaned text nodes in paragraphs
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      null
    )

    const orphanedTextNodes: Text[] = []
    let node: Node | null
    while (node = walker.nextNode()) {
      const textNode = node as Text
      const parent = textNode.parentNode
      
      if (parent && parent.nodeName === 'DIV' && textNode.textContent?.trim()) {
        orphanedTextNodes.push(textNode)
      }
    }

    orphanedTextNodes.forEach(textNode => {
      const p = document.createElement('p')
      p.textContent = textNode.textContent || ''
      textNode.parentNode?.replaceChild(p, textNode)
    })
  }

  /**
   * Analyze document structure for metadata
   */
  private analyzeDocumentStructure(container: HTMLElement) {
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const paragraphs = container.querySelectorAll('p')
    const lists = container.querySelectorAll('ul, ol')
    const tables = container.querySelectorAll('table')

    return {
      pages: 1, // Will be enhanced based on content analysis
      headings: headings.length,
      paragraphs: paragraphs.length,
      lists: lists.length,
      tables: tables.length,
      wordCount: this.estimateWordCount(container),
      layout: this.detectLayout(container)
    }
  }

  /**
   * Estimate word count
   */
  private estimateWordCount(container: HTMLElement): number {
    const text = container.textContent || ''
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  /**
   * Detect document layout
   */
  private detectLayout(container: HTMLElement): string {
    const tables = container.querySelectorAll('table')
    const lists = container.querySelectorAll('ul, ol')
    
    if (tables.length > 2) return 'tabular'
    if (lists.length > 3) return 'list-heavy'
    return 'standard'
  }

  /**
   * Convert edited HTML back to PDF with proper formatting
   */
  async convertHtmlToPdf(
    html: string,
    originalStructure: any,
    onProgress?: (progress: APIProgress) => void
  ): Promise<Uint8Array> {
    try {
      onProgress?.({ stage: 'processing', progress: 0, message: 'Preparing content...' })

      const { PDFDocument, rgb, StandardFonts, PageSizes } = await import('pdf-lib')
      
      const pdfDoc = await PDFDocument.create()
      
      // Set document metadata
      pdfDoc.setTitle('Edited Document')
      pdfDoc.setAuthor('PDF Editor')
      pdfDoc.setCreationDate(new Date())
      pdfDoc.setModificationDate(new Date())

      onProgress?.({ stage: 'processing', progress: 25, message: 'Processing content...' })
      
      // Parse HTML content
      const contentBlocks = this.parseHtmlToBlocks(html)
      
      onProgress?.({ stage: 'processing', progress: 50, message: 'Generating PDF pages...' })
      
      // Generate PDF pages
      await this.generatePdfPages(pdfDoc, contentBlocks, onProgress)

      onProgress?.({ stage: 'downloading', progress: 90, message: 'Finalizing PDF...' })
      
      const pdfBytes = await pdfDoc.save()
      
      onProgress?.({ stage: 'downloading', progress: 100, message: 'Download ready!' })
      
      return pdfBytes
    } catch (error) {
      console.error('HTML to PDF conversion failed:', error)
      throw error
    }
  }

  /**
   * Parse HTML content into structured blocks
   */
  private parseHtmlToBlocks(html: string) {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html

    const blocks: any[] = []
    const elements = tempDiv.children

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]
      const block = this.elementToBlock(element)
      if (block) blocks.push(block)
    }

    return blocks
  }

  /**
   * Convert HTML element to PDF block
   */
  private elementToBlock(element: Element) {
    const tagName = element.tagName.toLowerCase()
    const text = element.textContent?.trim() || ''
    
    if (!text) return null

    const block: any = {
      type: tagName,
      text: text,
      styles: this.extractElementStyles(element)
    }

    // Handle specific element types
    switch (tagName) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        block.fontSize = this.getHeadingSize(tagName)
        block.fontWeight = 'bold'
        block.marginTop = 20
        block.marginBottom = 10
        break
      
      case 'p':
        block.fontSize = 12
        block.marginTop = 6
        block.marginBottom = 6
        block.lineHeight = 1.5
        break
      
      case 'ul':
      case 'ol':
        block.type = 'list'
        block.items = this.extractListItems(element)
        block.fontSize = 12
        block.marginTop = 10
        block.marginBottom = 10
        break
      
      case 'table':
        block.type = 'table'
        block.data = this.extractTableData(element)
        block.fontSize = 10
        block.marginTop = 15
        block.marginBottom = 15
        break
    }

    return block
  }

  /**
   * Extract styles from element
   */
  private extractElementStyles(element: Element) {
    const styles: any = {}
    const style = element.getAttribute('style') || ''
    
    // Parse inline styles
    const styleRules = style.split(';')
    styleRules.forEach(rule => {
      const [property, value] = rule.split(':').map(s => s.trim())
      if (property && value) {
        styles[property] = value
      }
    })

    // Check for common classes
    const className = element.className || ''
    if (className.includes('text-center')) styles.textAlign = 'center'
    if (className.includes('text-right')) styles.textAlign = 'right'
    if (className.includes('font-bold')) styles.fontWeight = 'bold'
    if (className.includes('font-italic')) styles.fontStyle = 'italic'

    return styles
  }

  /**
   * Get heading font size
   */
  private getHeadingSize(tagName: string): number {
    const sizes: { [key: string]: number } = {
      'h1': 24,
      'h2': 20,
      'h3': 16,
      'h4': 14,
      'h5': 12,
      'h6': 11
    }
    return sizes[tagName] || 12
  }

  /**
   * Extract list items
   */
  private extractListItems(element: Element): string[] {
    const items: string[] = []
    const listItems = element.querySelectorAll('li')
    
    listItems.forEach(li => {
      const text = li.textContent?.trim()
      if (text) items.push(text)
    })

    return items
  }

  /**
   * Extract table data
   */
  private extractTableData(element: Element) {
    const rows: string[][] = []
    const tableRows = element.querySelectorAll('tr')
    
    tableRows.forEach(tr => {
      const cells: string[] = []
      const tableCells = tr.querySelectorAll('td, th')
      
      tableCells.forEach(cell => {
        cells.push(cell.textContent?.trim() || '')
      })
      
      if (cells.length > 0) rows.push(cells)
    })

    return rows
  }

  /**
   * Generate PDF pages from content blocks
   */
  private async generatePdfPages(pdfDoc: any, blocks: any[], onProgress?: (progress: APIProgress) => void) {
    const { rgb, StandardFonts, PageSizes } = await import('pdf-lib')
    
    let currentPage = pdfDoc.addPage(PageSizes.A4)
    let yPosition = 750
    const pageHeight = 792
    const pageWidth = 612
    const margin = 50
    const contentWidth = pageWidth - (margin * 2)

    // Embed fonts
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique)

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i]
      const progress = (i / blocks.length) * 40 + 50 // 50-90% range
      
      onProgress?.({ 
        stage: 'processing', 
        progress, 
        message: `Processing block ${i + 1}/${blocks.length}...` 
      })

      // Check if we need a new page
      const blockHeight = this.estimateBlockHeight(block, contentWidth, regularFont)
      
      if (yPosition - blockHeight < margin) {
        currentPage = pdfDoc.addPage(PageSizes.A4)
        yPosition = 750
      }

      // Render block based on type
      switch (block.type) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
          yPosition = await this.renderHeading(currentPage, block, yPosition, margin, contentWidth, boldFont)
          break
        
        case 'p':
          yPosition = await this.renderParagraph(currentPage, block, yPosition, margin, contentWidth, regularFont)
          break
        
        case 'list':
          yPosition = await this.renderList(currentPage, block, yPosition, margin, contentWidth, regularFont)
          break
        
        case 'table':
          yPosition = await this.renderTable(currentPage, block, yPosition, margin, contentWidth, regularFont)
          break
        
        default:
          yPosition = await this.renderParagraph(currentPage, block, yPosition, margin, contentWidth, regularFont)
      }
    }
  }

  /**
   * Estimate block height for pagination
   */
  private estimateBlockHeight(block: any, contentWidth: number, font: any): number {
    const fontSize = block.fontSize || 12
    const lineHeight = block.lineHeight || 1.5
    const text = block.text || ''
    
    // Estimate lines needed
    const avgCharWidth = fontSize * 0.6
    const charsPerLine = Math.floor(contentWidth / avgCharWidth)
    const lines = Math.ceil(text.length / charsPerLine)
    
    const textHeight = lines * fontSize * lineHeight
    const marginTop = block.marginTop || 0
    const marginBottom = block.marginBottom || 0
    
    return textHeight + marginTop + marginBottom
  }

  /**
   * Render heading block
   */
  private async renderHeading(page: any, block: any, yPosition: number, margin: number, contentWidth: number, font: any): Promise<number> {
    const { rgb } = await import('pdf-lib')
    
    yPosition -= (block.marginTop || 20)
    
    const lines = this.wrapText(block.text, contentWidth, font, block.fontSize)
    
    for (const line of lines) {
      page.drawText(line, {
        x: margin,
        y: yPosition,
        size: block.fontSize,
        font: font,
        color: rgb(0, 0, 0)
      })
      yPosition -= block.fontSize * 1.3
    }
    
    yPosition -= (block.marginBottom || 10)
    return yPosition
  }

  /**
   * Render paragraph block
   */
  private async renderParagraph(page: any, block: any, yPosition: number, margin: number, contentWidth: number, font: any): Promise<number> {
    const { rgb } = await import('pdf-lib')
    
    yPosition -= (block.marginTop || 6)
    
    const lines = this.wrapText(block.text, contentWidth, font, block.fontSize || 12)
    const lineHeight = (block.fontSize || 12) * (block.lineHeight || 1.5)
    
    for (const line of lines) {
      page.drawText(line, {
        x: margin,
        y: yPosition,
        size: block.fontSize || 12,
        font: font,
        color: rgb(0, 0, 0)
      })
      yPosition -= lineHeight
    }
    
    yPosition -= (block.marginBottom || 6)
    return yPosition
  }

  /**
   * Render list block
   */
  private async renderList(page: any, block: any, yPosition: number, margin: number, contentWidth: number, font: any): Promise<number> {
    const { rgb } = await import('pdf-lib')
    
    yPosition -= (block.marginTop || 10)
    
    for (let i = 0; i < block.items.length; i++) {
      const item = block.items[i]
      const bullet = `• ${item}`
      
      const lines = this.wrapText(bullet, contentWidth - 20, font, block.fontSize || 12)
      
      for (const line of lines) {
        page.drawText(line, {
          x: margin + 20,
          y: yPosition,
          size: block.fontSize || 12,
          font: font,
          color: rgb(0, 0, 0)
        })
        yPosition -= (block.fontSize || 12) * 1.4
      }
    }
    
    yPosition -= (block.marginBottom || 10)
    return yPosition
  }

  /**
   * Render table block
   */
  private async renderTable(page: any, block: any, yPosition: number, margin: number, contentWidth: number, font: any): Promise<number> {
    const { rgb } = await import('pdf-lib')
    
    yPosition -= (block.marginTop || 15)
    
    if (!block.data || block.data.length === 0) return yPosition
    
    const cellPadding = 5
    const rowHeight = (block.fontSize || 10) * 1.8
    const colWidth = contentWidth / block.data[0].length
    
    // Draw table rows
    for (let rowIndex = 0; rowIndex < block.data.length; rowIndex++) {
      const row = block.data[rowIndex]
      const isHeader = rowIndex === 0
      
      // Draw row background for header
      if (isHeader) {
        page.drawRectangle({
          x: margin,
          y: yPosition - rowHeight,
          width: contentWidth,
          height: rowHeight,
          color: rgb(0.95, 0.95, 0.95)
        })
      }
      
      // Draw cells
      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        const cell = row[colIndex]
        const cellX = margin + (colIndex * colWidth)
        
        // Draw cell border
        page.drawRectangle({
          x: cellX,
          y: yPosition - rowHeight,
          width: colWidth,
          height: rowHeight,
          borderColor: rgb(0.7, 0.7, 0.7),
          borderWidth: 0.5
        })
        
        // Draw cell text
        const lines = this.wrapText(cell, colWidth - (cellPadding * 2), font, block.fontSize || 10)
        let cellY = yPosition - cellPadding - (block.fontSize || 10)
        
        for (const line of lines) {
          page.drawText(line, {
            x: cellX + cellPadding,
            y: cellY,
            size: block.fontSize || 10,
            font: font,
            color: rgb(0, 0, 0)
          })
          cellY -= (block.fontSize || 10) * 1.2
        }
      }
      
      yPosition -= rowHeight
    }
    
    yPosition -= (block.marginBottom || 15)
    return yPosition
  }

  /**
   * Wrap text to fit within specified width
   */
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
          // Word is too long, break it
          lines.push(word)
        }
      }
    }
    
    if (currentLine) {
      lines.push(currentLine)
    }
    
    return lines.length > 0 ? lines : ['']
  }

  /**
   * Merge multiple PDFs into one with proper page handling
   */
  async mergePdfs(
    files: File[],
    onProgress?: (progress: APIProgress) => void
  ): Promise<Uint8Array> {
    const { PDFDocument } = await import('pdf-lib')
    const mergedPdf = await PDFDocument.create()

    // Set merged document metadata
    mergedPdf.setTitle('Merged Document')
    mergedPdf.setAuthor('PDF Editor')
    mergedPdf.setCreationDate(new Date())

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      onProgress?.({ 
        stage: 'processing', 
        progress: (i / files.length) * 100, 
        message: `Merging ${i + 1}/${files.length} files: ${file.name}` 
      })

      try {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
        const pageIndices = pdf.getPageIndices()
        
        // Copy all pages from source PDF
        const pages = await mergedPdf.copyPages(pdf, pageIndices)
        
        pages.forEach(page => mergedPdf.addPage(page))
        
        console.log(`Merged ${pages.length} pages from ${file.name}`)
      } catch (error) {
        console.error(`Failed to merge ${file.name}:`, error)
        throw new Error(`Failed to merge ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    const finalBytes = await mergedPdf.save()
    
    onProgress?.({ 
      stage: 'processing', 
      progress: 100, 
      message: `Merge complete! ${mergedPdf.getPageCount()} total pages` 
    })

    return finalBytes
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