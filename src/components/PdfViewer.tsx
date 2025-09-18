import React, { useEffect, useRef } from 'react'
import WebViewer from '@pdftron/webviewer'
import { usePdfState } from '../hooks/usePdfState'

interface PdfViewerProps {
  pdfBytes: Uint8Array | null
  onDocumentLoaded?: (pageCount: number) => void
  mode: 'select' | 'text'
  onCommitText: (annotation: any) => void
  onEditText: (edit: {
    oldText: string
    newText: string
    pageNumber: number
    x: number
    y: number
    width: number
    height: number
  }) => void
  textColor: string
  textSize: number
  previewAnnotations: any[]
}

const PdfViewer = ({
  pdfBytes,
  onDocumentLoaded,
  mode,
  onCommitText,
  onEditText,
  textColor,
  textSize,
  previewAnnotations
}: PdfViewerProps) => {
  const viewerDiv = useRef<HTMLDivElement>(null)
  const viewerInstanceRef = useRef<any>(null)
  const { setNumPages } = usePdfState()

  useEffect(() => {
    if (!viewerDiv.current || viewerInstanceRef.current) return

    const element = viewerDiv.current

    WebViewer(
      {
        path: '/lib/webviewer',
        licenseKey:
          import.meta.env.VITE_PDFTRON_LICENSE_KEY ||
          'demo:1757879970041:6045741f0300000000c1c10a42adeff7132c88744a5bed804c8c678ad5',
        fullAPI: true,
        enableFilePicker: false,
        enableTextEditing: true,
        enableRedaction: true,
        showToolbarControl: true
      },
      element
    )
      .then(async (instance) => {
        viewerInstanceRef.current = instance

        const { Core, UI } = instance
        const { documentViewer, annotationManager, Tools } = Core

        // Enable text editing features
        UI.enableFeatures([UI.Feature.TextSelection])
        UI.setToolMode('TextSelect')

        // Add event listeners
        documentViewer.addEventListener('documentLoaded', () => {
          const pageCount = documentViewer.getPageCount()
          setNumPages(pageCount)
          onDocumentLoaded?.(pageCount)
        })

        documentViewer.addEventListener('textEditorChanged', (oldText, newText, annotation) => {
          if (!annotation) return
          onEditText({
            oldText,
            newText,
            pageNumber: annotation.PageNumber,
            x: annotation.X,
            y: annotation.Y,
            width: annotation.Width,
            height: annotation.Height
          })
        })

        documentViewer.addEventListener('doubleClick', () => {
          documentViewer.setToolMode(documentViewer.getTool(Tools.ToolNames.EDIT))
        })

        annotationManager.addEventListener('textChanged', (annotation, action) => {
          if (action === 'add') {
            onCommitText(annotation)
          }
        })

        // Load initial document if available
        if (pdfBytes) {
          const arr = new Uint8Array(pdfBytes)
          const blob = new Blob([arr], { type: 'application/pdf' })
          documentViewer.loadDocument(blob)
        }
      })
      .catch((error) => {
        console.error('WebViewer initialization failed:', error)
      })

    // Cleanup
    return () => {
      if (viewerInstanceRef.current) {
        const instance = viewerInstanceRef.current
        if (instance.Core) {
          instance.Core.documentViewer.closeDocument()
        }
        if (instance.UI) {
          instance.UI.closeElements(['all'])
        }
        viewerInstanceRef.current = null
      }
    }
  }, []) // Initialize only once

  // Handle PDF updates
  useEffect(() => {
    if (!viewerInstanceRef.current || !pdfBytes) return

    try {
      const arr = new Uint8Array(pdfBytes)
      const blob = new Blob([arr], { type: 'application/pdf' })
      viewerInstanceRef.current.Core.documentViewer.loadDocument(blob)
    } catch (error) {
      console.error('Error loading document:', error)
    }
  }, [pdfBytes])

  // Handle mode changes
  useEffect(() => {
    if (!viewerInstanceRef.current) return
    const { documentViewer, Tools } = viewerInstanceRef.current.Core
    if (mode === 'text') {
      documentViewer.setToolMode(documentViewer.getTool(Tools.ToolNames.EDIT))
    } else {
      documentViewer.setToolMode(documentViewer.getTool(Tools.ToolNames.SELECT))
    }
  }, [mode])

  // Handle style changes
  useEffect(() => {
    if (!viewerInstanceRef.current) return
    const { annotationManager } = viewerInstanceRef.current.Core
    const freeTextDefaults = annotationManager.getAnnotationDisplayAuthorAndColor(
      'FreeText'
    )
    freeTextDefaults.textColor = textColor
    freeTextDefaults.fontSize = `${textSize}px`
    annotationManager.setAnnotationDisplayAuthorAndColor(
      'FreeText',
      freeTextDefaults
    )
  }, [textColor, textSize])

  // Handle annotation updates
  useEffect(() => {
    if (!viewerInstanceRef.current) return
    const { annotationManager } = viewerInstanceRef.current.Core
    annotationManager.importAnnotations(previewAnnotations)
  }, [previewAnnotations])

  return (
    <div className="h-full w-full">
      <div
        className="webviewer h-full w-full"
        ref={viewerDiv}
        onTouchStart={(e) => e.preventDefault()}
        onTouchMove={(e) => e.preventDefault()}
      />
    </div>
  )
}

export default PdfViewer
