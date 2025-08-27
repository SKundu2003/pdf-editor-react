import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Toolbar from '../components/Toolbar'
import PdfViewer from '../components/PdfViewer'
import PageThumbnails from '../components/PageThumbnails'
import UploadDropzone from '../components/UploadDropzone'
import { usePdfState } from '../hooks/usePdfState'
import type { AnnotationMode, TextAnnotation } from '../types/pdf'
import { downloadBytesAsFile } from '../utils/download'

export default function EditorPage(){
  const location = useLocation() as any
  const {
    pdfBytes,
    loadedPdfs,
    numPages,
    pageNumber,
    setPageNumber,
    scale,
    zoomIn,
    zoomOut,
    resetZoom,
    pageOrder,
    updateOrder,
    annotations,
    addText,
    loadFromFiles,
    onDocumentLoad,
    canExport,
    exportEdited,
    removePdf,
    clearAllPdfs
  } = usePdfState()

  const [mode, setMode] = useState<AnnotationMode>('select')
  const [textColor, setTextColor] = useState('#111827')
  const [textSize, setTextSize] = useState(14)
  const [error, setError] = useState<string | null>(null)

  // Load files from landing page navigation (guarded to avoid StrictMode double-call)
  const loadedNavKeyRef = useRef<string | null>(null)
  useEffect(() => {
    const files = (location?.state?.files as File[] | undefined) || undefined
    if (!files || files.length === 0) return
    const key = files.map(f => `${f.name}:${f.size}:${f.lastModified}`).join('|')
    if (loadedNavKeyRef.current === key) return
    loadedNavKeyRef.current = key
    loadFromFiles(files).catch(err => setError(String(err)))
  }, [location?.state?.files, loadFromFiles])

  const previewAnnotations = useMemo(() => annotations, [annotations])

  async function handleExport(){
    setError(null)
    try {
      const out = await exportEdited()
      if (!out) throw new Error('Nothing to export')
      downloadBytesAsFile(out, 'edited.pdf')
    } catch (e:any) {
      setError(e?.message || 'Failed to export PDF')
    }
  }

  const handleRemovePdf = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    removePdf(id)
  }

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <Toolbar
        onOpenFiles={async (files) => {
          setError(null)
          try {
            await loadFromFiles(files)
          } catch (e: any) {
            setError(e?.message || 'Failed to load files')
          }
        }}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={resetZoom}
        pageNumber={pageNumber}
        numPages={numPages}
        setPageNumber={setPageNumber}
        mode={mode as any}
        setMode={setMode as any}
        textColor={textColor}
        setTextColor={setTextColor}
        textSize={textSize}
        setTextSize={setTextSize}
        onExport={handleExport}
        canExport={canExport}
        onClearAll={loadedPdfs.length > 0 ? clearAllPdfs : undefined}
      />

      {/* Display loaded PDFs */}
      {loadedPdfs.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex flex-wrap gap-2 mb-2">
            {loadedPdfs.map((pdf) => (
              <div
                key={pdf.id}
                className="flex items-center bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800"
              >
                <span className="truncate max-w-xs">{pdf.name}</span>
                <button
                  onClick={(e) => handleRemovePdf(pdf.id, e)}
                  className="ml-2 text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-100"
                  title="Remove PDF"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="rounded-md border border-red-300 bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</div>
        </div>
      )}

      {!pdfBytes || pdfBytes.length === 0 ? (
        <div className="max-w-3xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-4">Upload PDFs to start editing</h2>
          <UploadDropzone onFilesSelected={async (fs)=> {
            setError(null)
            try {
              await loadFromFiles(fs)
            } catch (e:any) {
              setError(e?.message || 'Failed to load files')
            }
          }} />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[260px,1fr] gap-4 px-4 py-4">
          {/* Sidebar thumbnails */}
          <aside className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/50 h-[calc(100vh-14rem)] sticky top-[7.5rem]">
            <PageThumbnails
              pdfBytes={pdfBytes}
              pageOrder={pageOrder}
              setPageOrder={updateOrder}
              currentPage={pageNumber}
              onSelectPage={setPageNumber}
            />
          </aside>

          {/* Viewer */}
          <section className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/50 h-[calc(100vh-14rem)]">
            <PdfViewer
              pdfBytes={pdfBytes}
              pageNumber={pageNumber}
              scale={scale}
              onDocumentLoad={onDocumentLoad}
              mode={mode as any}
              textColor={textColor}
              textSize={textSize}
              onCommitText={(ann)=> addText(ann)}
              previewAnnotations={previewAnnotations}
            />
          </section>
        </div>
      )}
    </div>
  )
}
