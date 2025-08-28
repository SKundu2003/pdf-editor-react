import { Document, Page } from 'react-pdf'
import type { TextItem } from 'pdfjs-dist/types/src/display/api'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { TextAnnotation, TextFormat } from '../types/pdf'
import TextEditor from './TextEditor'

// NOTE: worker is configured in setupPdfWorker.ts which is imported in main.tsx.
// Do NOT set pdfjs.GlobalWorkerOptions.workerSrc here.

type PdfViewerProps = {
  pdfBytes: Uint8Array
  pageNumber: number
  scale: number
  onDocumentLoad?: (numPages: number) => void
  mode?: 'select' | 'text'
  textColor?: string
  textSize?: number
  onCommitText?: (ann: TextAnnotation) => void
  previewAnnotations?: TextAnnotation[]
}

export default function PdfViewer({
  pdfBytes,
  pageNumber,
  scale,
  onDocumentLoad,
  mode = 'select',
  textColor = '#111827',
  textSize = 14,
  onCommitText,
  previewAnnotations = []
}: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [activeEditor, setActiveEditor] = useState<{
    id?: string
    x: number
    y: number
    xPoints: number
    yPoints: number
    text: string
    formats?: TextFormat[]
    pageNumber?: number
    isEditing?: boolean
  } | null>(null)

  const [pageSize, setPageSize] = useState<{ width: number; height: number } | null>(null)

  const file = useMemo(() => ({ data: new Uint8Array(pdfBytes) }), [pdfBytes])

  // Utility: PDF points -> CSS pixels at given scale
  const pointsToPx = (pt: number) => (pt / 72) * 96 * scale
  // Utility: CSS pixels -> PDF points
  const pxToPoints = (px: number) => (px / scale) * (72 / 96)

  // Open editor for an existing annotation (by annotation object)
  const handleTextEdit = useCallback((annotation: TextAnnotation) => {
    if (!containerRef.current || annotation.x === undefined || annotation.y === undefined) return
    const containerRect = containerRef.current.getBoundingClientRect()
    const xPx = pointsToPx(annotation.x)
    const yPx = containerRect.height - pointsToPx(annotation.y) // flip Y axis
    setActiveEditor({
      id: annotation.id,
      x: xPx - 5,
      y: yPx - 5,
      xPoints: annotation.x,
      yPoints: annotation.y,
      text: annotation.text || '',
      formats: annotation.formats || [],
      pageNumber: annotation.pageNumber || pageNumber
    })
  }, [scale, pageNumber]) // eslint-disable-line

  // Save/commit text from editor (text is plain text, formats is array)
  const handleTextCommit = useCallback((text: string = '', formats: TextFormat[] = []) => {
    if (!activeEditor) return
    const annotation: TextAnnotation = {
      id: activeEditor.id || `text-${Date.now()}`,
      type: 'text',
      x: activeEditor.xPoints,
      y: activeEditor.yPoints,
      text: text || '',
      formats: formats || activeEditor.formats || [],
      style: {
        color: textColor || '#000000',
        fontSize: activeEditor?.pageNumber ? (textSize || 12) : (textSize || 12) // keep numeric value for PDF rendering
      },
      pageNumber: activeEditor.pageNumber || pageNumber
    }

    onCommitText?.(annotation)
    setActiveEditor(null)
  }, [activeEditor, onCommitText, textColor, textSize, pageNumber])

  // Edit inline (click on preview annotation)
  const handleInlineEdit = (annotation: TextAnnotation) => {
    if (!containerRef.current || annotation.x === undefined || annotation.y === undefined) return
    const containerRect = containerRef.current.getBoundingClientRect()
    const xPx = pointsToPx(annotation.x)
    const yPx = containerRect.height - pointsToPx(annotation.y)
    setActiveEditor({
      id: annotation.id,
      x: xPx - 5,
      y: yPx - 5,
      xPoints: annotation.x,
      yPoints: annotation.y,
      text: annotation.text || '',
      formats: annotation.formats || [],
      pageNumber: annotation.pageNumber || pageNumber,
      isEditing: true
    })
  }

  // Page click => add new text if in text mode
  const handlePageClick = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const xPoints = pxToPoints(x)
    const yPoints = pxToPoints(rect.height - y) // flip Y

    if (mode === 'text') {
      setActiveEditor({
        x: x - 5,
        y: y - 5,
        xPoints,
        yPoints,
        text: '',
        formats: [],
        pageNumber
      })
    } else if (mode === 'select') {
      // Determine if clicked on existing annotation (approximate box)
      const clicked = previewAnnotations.find(ann => {
        if (ann.x === undefined || ann.y === undefined || !ann.text) return false
        const fontPt = ann.style?.fontSize || textSize
        const fontPx = (fontPt / 72) * 96 * scale
        const textWidth = (ann.text.length || 0) * (fontPx * 0.6)
        const textHeight = fontPx * 1.2

        const annX = pointsToPx(ann.x)
        const annY = (containerRef.current!.getBoundingClientRect().height) - pointsToPx(ann.y) // flip Y

        return (
          x >= annX &&
          x <= annX + textWidth &&
          y >= annY - textHeight &&
          y <= annY
        )
      })

      if (clicked) {
        handleTextEdit(clicked)
      } else {
        setActiveEditor(null)
      }
    }
  }, [mode, previewAnnotations, scale, handleTextEdit, pageNumber, textSize]) // eslint-disable-line

  // Save page size on load (used for positioning)
  const handlePageLoad = useCallback(({ width, height }: { width: number; height: number }) => {
    setPageSize({ width, height })
  }, [])

  return (
    <div className="w-full h-full overflow-auto">
      <div className="flex justify-center p-4">
        <div
          ref={containerRef}
          className="relative shadow-md"
          onClick={handlePageClick}
        >
          <Document
            file={file}
            onLoadSuccess={(doc) => onDocumentLoad?.(doc.numPages)}
            onLoadError={(err) => console.error('Failed to load PDF:', err)}
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              onLoadSuccess={handlePageLoad}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            >
              {/* Render preview annotations positioned over page */}
              {(containerRef.current ? previewAnnotations : []).map((ann) => {
                // compute pixel coords from PDF points
                if (ann.x === undefined || ann.y === undefined) return null
                const rect = containerRef.current?.getBoundingClientRect()
                const annX = pointsToPx(ann.x)
                const annY = (rect ? rect.height : 0) - pointsToPx(ann.y) // flip Y
                const fontPt = ann.style?.fontSize || textSize
                const fontPx = (fontPt / 72) * 96 * scale

                return (
                  <div
                    key={ann.id}
                    style={{
                      position: 'absolute',
                      left: `${annX}px`,
                      top: `${annY - (fontPx * 0.2)}px`, // slight vertical adjustment
                      color: ann.style?.color || textColor,
                      fontSize: `${fontPx}px`,
                      whiteSpace: 'nowrap',
                      cursor: 'text',
                      userSelect: 'none',
                      zIndex: 5,
                      pointerEvents: 'auto'
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleInlineEdit(ann)
                    }}
                  >
                    {ann.text}
                  </div>
                )
              })}
            </Page>
          </Document>

          {/* Editor overlay (rendered inside same relative container so left/top are correct) */}
          {activeEditor ? (
            <TextEditor
              x={activeEditor.x}
              y={activeEditor.y}
              initialText={activeEditor.text}
              initialFormats={activeEditor.formats || []}
              onSave={(text, formats) => handleTextCommit(text, formats)}
              onCancel={() => setActiveEditor(null)}
              textColor={textColor}
              textSize={textSize}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
