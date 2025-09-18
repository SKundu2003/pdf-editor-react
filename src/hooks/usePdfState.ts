import React, { useState, useCallback, useMemo } from 'react'
import { PDFDocument } from 'pdf-lib'
import { fileToBytes, mergePdfs, reorderPages, addTextAnnotations, editTextInPdf } from '../services/pdfService'
import type { TextAnnotation, EditedText } from '../types/pdf'

interface LoadedPdf {
  id: string
  name: string
  bytes: Uint8Array
  pageCount: number
}

export function usePdfState() {
  const [loadedPdfs, setLoadedPdfs] = useState<LoadedPdf[]>([])
  const [mergedPdf, setMergedPdf] = useState<Uint8Array | null>(null)
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1)
  const [annotations, setAnnotations] = useState<TextAnnotation[]>([])
  const [pageOrder, setPageOrder] = useState<number[]>([])

  const loadPdfFile = useCallback(async (file: File): Promise<LoadedPdf> => {
    const bytes = await fileToBytes(file)
    const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true })
    return {
      id: `${file.name}-${file.size}-${file.lastModified}`,
      name: file.name,
      bytes,
      pageCount: pdfDoc.getPageCount(),
    }
  }, [])

  const loadFromFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return
      try {
        const newLoadedPdfs = await Promise.all(Array.from(files).map(loadPdfFile))
        setLoadedPdfs(prev => [...prev, ...newLoadedPdfs])
      } catch (error) {
        console.error('Error loading PDFs:', error)
      }
    },
    [loadPdfFile]
  )

  const updateMergedPdf = useCallback(async () => {
    if (loadedPdfs.length === 0) {
      setMergedPdf(null)
      setNumPages(0)
      return
    }
    try {
      const bytes = loadedPdfs.length === 1 ? loadedPdfs[0].bytes : await mergePdfs(loadedPdfs.map(p => p.bytes))
      setMergedPdf(bytes)
      const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true })
      setNumPages(pdfDoc.getPageCount())
      setPageOrder(Array.from({ length: pdfDoc.getPageCount() }, (_, i) => i))
    } catch (error) {
      console.error('Error updating merged PDF:', error)
    }
  }, [loadedPdfs])

  // Effect to merge PDFs when loadedPdfs changes
  React.useEffect(() => {
    updateMergedPdf()
  }, [loadedPdfs, updateMergedPdf])


  const onDocumentLoad = useCallback((pageCount: number) => {
    setNumPages(pageCount)
    setPageOrder(Array.from({ length: pageCount }, (_, i) => i))
  }, [])

  const zoomIn = useCallback(() => setScale(s => Math.min(3, s + 0.1)), [])
  const zoomOut = useCallback(() => setScale(s => Math.max(0.3, s - 0.1)), [])
  const resetZoom = useCallback(() => setScale(1), [])

  const addText = useCallback((annotation: TextAnnotation) => {
    setAnnotations(prev => [...prev, annotation])
  }, [])

  const editText = useCallback(async (edit: EditedText) => {
    if (!mergedPdf) return
    try {
      const updatedPdfBytes = await editTextInPdf(mergedPdf, edit)
      setMergedPdf(updatedPdfBytes)
    } catch (error) {
      console.error('Error editing text:', error)
    }
  }, [mergedPdf])

  const updateOrder = useCallback((newOrder: number[]) => {
    setPageOrder(newOrder)
  }, [])

  const canExport = useMemo(() => mergedPdf && numPages > 0, [mergedPdf, numPages])

  const exportEdited = useCallback(async () => {
    if (!mergedPdf) return null
    let bytes = mergedPdf
    if (pageOrder.some((p, i) => p !== i)) {
      bytes = await reorderPages(bytes, pageOrder)
    }
    if (annotations.length > 0) {
      bytes = await addTextAnnotations(bytes, annotations)
    }
    return bytes
  }, [mergedPdf, annotations, pageOrder])

  const removePdf = useCallback((id: string) => {
    setLoadedPdfs(prev => prev.filter(p => p.id !== id))
  }, [])

  const clearAllPdfs = useCallback(() => {
    setLoadedPdfs([])
    setAnnotations([])
    setPageNumber(1)
  }, [])

  return {
    pdfBytes: mergedPdf,
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
    editText,
    loadFromFiles,
    onDocumentLoad,
    canExport,
    exportEdited,
    removePdf,
    clearAllPdfs,
  }
}
