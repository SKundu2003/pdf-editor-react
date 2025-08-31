import React, { useState, useCallback } from 'react'
import { Document, Page } from 'react-pdf'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'
import { Button } from '../UI/Button'
import { useEditorStore } from '../../store/editorStore'
import { cn } from '../../utils/cn'

export default function PDFPreview() {
  const { currentPdf } = useEditorStore()
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)
  const [rotation, setRotation] = useState<number>(0)

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setPageNumber(1)
  }, [])

  const goToPrevPage = () => setPageNumber(page => Math.max(1, page - 1))
  const goToNextPage = () => setPageNumber(page => Math.min(numPages, page + 1))
  const zoomIn = () => setScale(s => Math.min(2.0, s + 0.1))
  const zoomOut = () => setScale(s => Math.max(0.5, s - 0.1))
  const resetZoom = () => setScale(1.0)
  const rotate = () => setRotation(r => (r + 90) % 360)

  // Get the file to display
  const getFileToDisplay = () => {
    if (!currentPdf) return null
    
    if ('file' in currentPdf) {
      // Single PDF file
      return currentPdf.status === 'ready' ? currentPdf.file : null
    } else if ('bytes' in currentPdf && currentPdf.bytes) {
      // Merged PDF
      return new File([currentPdf.bytes], currentPdf.name, { type: 'application/pdf' })
    }
    
    return null
  }

  const fileToDisplay = getFileToDisplay()

  if (!fileToDisplay) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
            <FileText className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-slate-600 dark:text-slate-400">Select a PDF to preview</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
      {/* Preview Controls */}
      <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToPrevPage} disabled={pageNumber <= 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[80px] text-center">
            {pageNumber} / {numPages}
          </span>
          <Button variant="outline" size="sm" onClick={goToNextPage} disabled={pageNumber >= numPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={zoomOut} disabled={scale <= 0.5}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={resetZoom}>
            {Math.round(scale * 100)}%
          </Button>
          <Button variant="ghost" size="sm" onClick={zoomIn} disabled={scale >= 2.0}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={rotate}>
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Display */}
      <div className="flex-1 overflow-auto p-4">
        <div className="flex justify-center">
          <div className="shadow-lg">
            <Document
              file={fileToDisplay}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(error) => console.error('PDF load error:', error)}
              loading={
                <div className="w-[600px] h-[800px] bg-slate-100 dark:bg-slate-800 animate-pulse rounded" />
              }
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                rotate={rotation}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="shadow-md"
              />
            </Document>
          </div>
        </div>
      </div>
    </div>
  )
}

// Import FileText icon
import { FileText } from 'lucide-react'