import { Document, Page, pdfjs } from 'react-pdf'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { TextAnnotation } from '../types/pdf'

export type PdfViewerProps = {
  pdfBytes: Uint8Array
  pageNumber: number
  scale: number
  onDocumentLoad?: (numPages: number) => void
  // Live text editing
  mode?: 'select' | 'text'
  textColor?: string
  textSize?: number
  onCommitText?: (ann: TextAnnotation) => void
  // Previews of annotations not yet embedded
  previewAnnotations?: TextAnnotation[]
}

export default function PdfViewer({ pdfBytes, pageNumber, scale, onDocumentLoad, mode = 'select', textColor = '#111827', textSize = 14, onCommitText, previewAnnotations = [] }: PdfViewerProps){
  const containerRef = useRef<HTMLDivElement>(null)
  const [pageSizePx, setPageSizePx] = useState<{ width: number; height: number } | null>(null)
  const [editor, setEditor] = useState<null | { left: number; top: number; xPoints: number; yPoints: number; value: string }>(null)
  // Memoize data and file to avoid unnecessary reloads and "file prop changed" warnings
  const data = useMemo(() => new Uint8Array(pdfBytes), [pdfBytes])
  const file = useMemo(() => ({ data }), [data])

  useEffect(() => {
    // ensure worker is set from setupPdfWorker.ts
    void pdfjs
  }, [])

  return (
    <div className="w-full h-full overflow-auto">
      <div className="flex justify-center p-4">
        <div
          ref={containerRef}
          className="relative shadow-md"
          onClick={(e) => {
            if (mode !== 'text' || !containerRef.current || !pageSizePx) return
            const rect = containerRef.current.getBoundingClientRect()
            const xPx = e.clientX - rect.left
            const yFromTopPx = e.clientY - rect.top
            const heightPx = pageSizePx.height
            const xPoints = xPx / scale
            const yPoints = (heightPx - yFromTopPx) / scale
            setEditor({ left: xPx, top: yFromTopPx, xPoints, yPoints, value: '' })
          }}
        >
          <Document
            file={file}
            onLoadSuccess={(doc)=> onDocumentLoad?.(doc.numPages)}
            onLoadError={(err)=> { console.error('react-pdf onLoadError:', err) }}
            onSourceError={(err)=> { console.error('react-pdf onSourceError:', err) }}
            onPassword={(updatePassword, _reason) => {
              const pwd = window.prompt('This PDF is password-protected. Enter password:')
              if (pwd) updatePassword(pwd)
            }}
            error={
              <div className="w-[600px] h-[800px] flex items-center justify-center rounded border border-red-300 bg-red-50 text-red-700 p-4 text-sm">
                Failed to load PDF. See console for details.
              </div>
            }
            loading={<Skeleton />}
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              className="bg-white"
              onLoadSuccess={(page)=> {
                const viewport = page.getViewport({ scale })
                setPageSizePx({ width: viewport.width, height: viewport.height })
              }}
            />
          </Document>
          {/* Annotation previews */}
          {pageSizePx && previewAnnotations.filter(a => a.pageIndex === pageNumber - 1).map((a, idx) => {
            const x = a.x * scale
            const top = pageSizePx.height - a.y * scale
            return (
              <div key={idx} className="absolute pointer-events-none" style={{ left: x, top }}>
                <span style={{ fontSize: a.style.fontSize * scale, color: a.style.color }}>{a.text}</span>
              </div>
            )
          })}

          {/* Inline text editor */}
          {editor && (
            <input
              autoFocus
              className="absolute bg-white/90 dark:bg-slate-900/90 border border-primary-400 rounded px-2 py-1 shadow outline-none"
              style={{ left: editor.left, top: editor.top, fontSize: textSize * scale, color: textColor, minWidth: 40 }}
              value={editor.value}
              onChange={(e) => setEditor(prev => prev ? { ...prev, value: e.target.value } : prev)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = editor.value.trim()
                  if (val && onCommitText) {
                    onCommitText({ pageIndex: pageNumber - 1, text: val, x: editor.xPoints, y: editor.yPoints, style: { color: textColor, fontSize: textSize } })
                  }
                  setEditor(null)
                } else if (e.key === 'Escape') {
                  setEditor(null)
                }
              }}
              onBlur={() => {
                const val = editor.value.trim()
                if (val && onCommitText) {
                  onCommitText({ pageIndex: pageNumber - 1, text: val, x: editor.xPoints, y: editor.yPoints, style: { color: textColor, fontSize: textSize } })
                }
                setEditor(null)
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function Skeleton(){
  return (
    <div className="w-[600px] h-[800px] bg-slate-100 dark:bg-slate-800 animate-pulse rounded" />
  )
}
