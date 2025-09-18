import React, { useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Toolbar from '../components/Toolbar'
import PdfViewer from '../components/PdfViewer'
import UploadDropzone from '../components/UploadDropzone'
import { usePdf } from '../context/PdfContext'
import { downloadBytesAsFile } from '../utils/download'

export default function EditorPage() {
  const location = useLocation() as any
  const {
    pdfBytes,
    loadFromFiles,
    onDocumentLoad,
    numPages,
    pageNumber,
    setPageNumber,
    scale,
    zoomIn,
    zoomOut,
    resetZoom,
    updateOrder,
    annotations,
    addText,
    editText, // Added editText
    canExport,
    exportEdited,
    removePdf,
    clearAllPdfs,
    loadedPdfs
  } = usePdf()

  const [mode, setMode] = useState<'select' | 'text'>('select')
  const [textColor, setTextColor] = useState('#111827')
  const [textSize, setTextSize] = useState(14)
  const [error, setError] = useState<string | null>(null)

  // Handle adding new text annotations
  const handleTextAdd = useCallback((ann: any) => {
    try {
      // Ensure required fields are present
      if (ann.x === undefined || ann.y === undefined || ann.text === undefined) {
        console.warn('Missing required fields in text annotation:', ann)
        return
      }

      addText({
        ...ann,
        id: ann.id || `text-${Date.now()}`,
        pageNumber: ann.pageNumber || pageNumber,
        style: {
          color: textColor,
          fontSize: textSize
        },
        formats: ann.formats || []
      })
    } catch (error) {
      console.error('Error adding text annotation:', error)
      setError('Failed to add text annotation')
    }
  }, [addText, pageNumber, textColor, textSize])

  // Handle editing text
  const handleEditText = useCallback(
    (edit: {
      oldText: string
      newText: string
      pageNumber: number
      x: number
      y: number
      width: number
      height: number
    }) => {
      try {
        editText(edit)
      } catch (error) {
        console.error('Error editing text:', error)
        setError('Failed to edit text')
      }
    },
    [editText]
  )

  // Update document title based on mode
  React.useEffect(() => {
    document.title = mode === 'text' ? 'PDF Editor - Text Mode' : 'PDF Editor'
  }, [mode])

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle text mode with Escape key
      if (e.key === 'Escape' && mode === 'text') {
        setMode('select')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [mode])
  const loadedNavKeyRef = React.useRef<string | null>(null)
  React.useEffect(() => {
    const files = (location?.state?.files as File[] | undefined) || undefined
    if (!files || files.length === 0) return
    const key = files.map(f => `${f.name}:${f.size}:${f.lastModified}`).join('|')
    if (loadedNavKeyRef.current === key) return
    loadedNavKeyRef.current = key
    loadFromFiles(files).catch(err => setError(String(err)))
  }, [location?.state?.files, loadFromFiles])

  const previewAnnotations = React.useMemo(() => annotations, [annotations])

  async function handleExport() {
    setError(null)
    try {
      const out = await exportEdited()
      if (!out) throw new Error('Nothing to export')
      downloadBytesAsFile(out, 'edited.pdf')
    } catch (e: any) {
      setError(e?.message || 'Failed to export PDF')
    }
  }

  const handleRemovePdf = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    removePdf(id)
  }

  const handleOpenFiles = async (files: File[]) => {
    setError(null)
    try {
      await loadFromFiles(files)
    } catch (e: any) {
      setError(e?.message || 'Failed to load files')
    }
  }

  const handleFileUpload = useCallback(async (files: File[]) => {
    setError(null)
    try {
      await loadFromFiles(files)
    } catch (e: any) {
      console.error('File upload error:', e)
      setError(e?.message || 'Failed to load PDF file')
    }
  }, [loadFromFiles])

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Toolbar
        onOpenFiles={handleOpenFiles}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={resetZoom}
        pageNumber={pageNumber}
        numPages={numPages}
        setPageNumber={setPageNumber}
        mode={mode}
        setMode={setMode}
        textColor={textColor}
        setTextColor={setTextColor}
        textSize={textSize}
        setTextSize={setTextSize}
        onExport={handleExport}
        canExport={canExport}
        onClearAll={loadedPdfs.length > 0 ? clearAllPdfs : undefined}
      />

      <div className="flex-1 relative overflow-hidden">
        {!pdfBytes || pdfBytes.length === 0 ? (
          <div className="max-w-3xl mx-auto px-6 py-12">
            <h2 className="text-2xl font-bold mb-4">Upload a PDF to start editing</h2>
            <UploadDropzone
              onFilesSelected={handleFileUpload}
              accept=".pdf"
              maxFiles={1}
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-white shadow-lg rounded-lg m-4">
            <PdfViewer
              pdfBytes={pdfBytes}
              onDocumentLoaded={onDocumentLoad}
              mode={mode}
              textColor={textColor}
              textSize={textSize}
              onCommitText={handleTextAdd}
              onEditText={handleEditText} // Added onEditText
              previewAnnotations={previewAnnotations}
            />
          </div>
        )}

        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <div className="rounded-md border border-red-300 bg-red-50 text-red-700 px-4 py-3 text-sm shadow-lg">
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
