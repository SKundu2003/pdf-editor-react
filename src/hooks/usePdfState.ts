import { useCallback, useState, useEffect, useMemo } from 'react'
import { PDFDocument } from 'pdf-lib'
import type { TextAnnotation } from '../types/pdf'
import { fileToBytes, mergePdfs, reorderPages, addTextAnnotations } from '../services/pdfService'

interface LoadedPdf {
  id: string;
  name: string;
  bytes: Uint8Array;
  pageCount: number;
}

export function usePdfState() {
  const [loadedPdfs, setLoadedPdfs] = useState<LoadedPdf[]>([])
  const [mergedPdf, setMergedPdf] = useState<Uint8Array | null>(null)
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [pageOrder, setPageOrder] = useState<number[]>([])
  const [annotations, setAnnotations] = useState<TextAnnotation[]>([])

  // Function to load and parse a single PDF file
  const loadPdfFile = useCallback(async (file: File): Promise<LoadedPdf> => {
    const bytes = await fileToBytes(file)
    const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true })
    return {
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      bytes,
      pageCount: pdfDoc.getPageCount()
    }
  }, [])

  // Effect to merge PDFs when loadedPdfs changes
  useEffect(() => {
    const mergeAllPdfs = async () => {
      if (loadedPdfs.length === 0) {
        setMergedPdf(null)
        setNumPages(0)
        return
      }

      try {
        const pdfsToMerge = loadedPdfs.map(pdf => pdf.bytes)
        const merged = pdfsToMerge.length === 1 ? pdfsToMerge[0] : await mergePdfs(pdfsToMerge)
        setMergedPdf(merged)
        // Reset page number and annotations when new PDFs are loaded
        setPageNumber(1)
        setAnnotations([])
        setPageOrder([])
      } catch (error) {
        console.error('Error merging PDFs:', error)
      }
    }

    mergeAllPdfs()
  }, [loadedPdfs])

  const loadFromFiles = useCallback(async (files: File[]) => {
    if (!files || files.length === 0) return
    
    try {
      const newPdfs = await Promise.all(Array.from(files).map(loadPdfFile))
      setLoadedPdfs(prev => [...prev, ...newPdfs])
    } catch (error) {
      console.error('Error loading PDFs:', error)
    }
  }, [loadPdfFile])

  const onDocumentLoad = useCallback((pages: number) => {
    setNumPages(pages)
    // Initialize order only when needed to preserve user reordering
    setPageOrder(prev => (prev.length !== pages ? Array.from({ length: pages }, (_, i) => i) : prev))
  }, [])

  const zoomIn = useCallback(() => setScale(s => Math.min(3, s + 0.1)), [])
  const zoomOut = useCallback(() => setScale(s => Math.max(0.3, s - 0.1)), [])
  const resetZoom = useCallback(() => setScale(1), [])

  const canExport = useMemo(() => !!mergedPdf && numPages > 0, [mergedPdf, numPages])

  // Function to add a text annotation
  const addText = useCallback((annotation: TextAnnotation) => {
    setAnnotations(prev => {
      // Update existing annotation if it has the same ID, otherwise add new one
      const existingIndex = prev.findIndex(a => a.id === annotation.id)
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = annotation
        return updated
      }
      return [...prev, annotation]
    })
  }, [])

  const updateOrder = useCallback((newOrder: number[]) => {
    setPageOrder(newOrder)
  }, [])

  const exportEdited = useCallback(async (): Promise<Uint8Array | null> => {
    if (!mergedPdf) return null
    let bytes = mergedPdf
    // Reorder if needed
    const isSame = pageOrder.every((v, i) => v === i)
    if (!isSame) {
      bytes = await reorderPages(bytes, pageOrder)
    }
    // Add annotations
    if (annotations.length > 0) {
      bytes = await addTextAnnotations(bytes, annotations)
    }
    return bytes
  }, [mergedPdf, pageOrder, annotations])

  // Function to remove a PDF from the loaded list
  const removePdf = useCallback((id: string) => {
    setLoadedPdfs(prev => prev.filter(pdf => pdf.id !== id))
  }, [])

  // Function to clear all loaded PDFs
  const clearAllPdfs = useCallback(() => {
    setLoadedPdfs([])
  }, [])

  return {
    pdfBytes: mergedPdf,
    loadedPdfs,
    numPages,
    pageNumber,
    setPageNumber,
    scale,
    setScale,
    zoomIn,
    zoomOut,
    resetZoom,
    pageOrder,
    updateOrder,
    annotations,
    addText,
    loadFromFiles,
    onDocumentLoad,
    canExport: !!mergedPdf && numPages > 0,
    exportEdited,
    removePdf,
    clearAllPdfs
  }
}
