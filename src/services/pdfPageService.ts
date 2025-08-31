import { PDFDocument, PDFPage } from 'pdf-lib'
import type { PageInfo, PDFFile } from '../types/editor'

/**
 * Service for handling page-level operations across multiple PDFs
 */
export class PDFPageService {
  /**
   * Extract all pages from multiple PDFs and create a reorderable list
   */
  static async extractAllPages(files: PDFFile[]): Promise<{
    pages: PageInfo[]
    pdfDocuments: Map<string, PDFDocument>
  }> {
    const pages: PageInfo[] = []
    const pdfDocuments = new Map<string, PDFDocument>()
    let globalIndex = 0

    for (const file of files.filter(f => f.status === 'ready')) {
      try {
        const arrayBuffer = await file.file.arrayBuffer()
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
        pdfDocuments.set(file.id, pdfDoc)

        for (let pageNum = 1; pageNum <= pdfDoc.getPageCount(); pageNum++) {
          pages.push({
            id: `${file.id}-page-${pageNum}`,
            fileId: file.id,
            fileName: file.name,
            pageNumber: pageNum,
            globalIndex: globalIndex++
          })
        }
      } catch (error) {
        console.error(`Failed to load PDF ${file.name}:`, error)
      }
    }

    return { pages, pdfDocuments }
  }

  /**
   * Create a new PDF with pages in the specified order
   */
  static async createReorderedPDF(
    pageOrder: PageInfo[],
    pdfDocuments: Map<string, PDFDocument>
  ): Promise<Uint8Array> {
    const newPdf = await PDFDocument.create()

    for (const pageInfo of pageOrder) {
      const sourcePdf = pdfDocuments.get(pageInfo.fileId)
      if (!sourcePdf) continue

      try {
        // Copy the specific page from source PDF
        const [copiedPage] = await newPdf.copyPages(sourcePdf, [pageInfo.pageNumber - 1])
        newPdf.addPage(copiedPage)
      } catch (error) {
        console.error(`Failed to copy page ${pageInfo.pageNumber} from ${pageInfo.fileName}:`, error)
      }
    }

    return await newPdf.save()
  }

  /**
   * Get page thumbnail as data URL (simplified implementation)
   */
  static async getPageThumbnail(
    pdfDoc: PDFDocument,
    pageIndex: number,
    width: number = 150
  ): Promise<string> {
    try {
      // This is a simplified implementation
      // In a real app, you'd render the page to canvas and get the data URL
      return `data:image/svg+xml;base64,${btoa(`
        <svg width="${width}" height="${Math.round(width * 1.4)}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
          <text x="50%" y="50%" text-anchor="middle" dy="0.3em" font-family="Arial" font-size="12" fill="#64748b">
            Page ${pageIndex + 1}
          </text>
        </svg>
      `)}`
    } catch (error) {
      console.error('Failed to generate thumbnail:', error)
      return ''
    }
  }
}