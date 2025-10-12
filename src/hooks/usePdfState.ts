import React, { useState, useCallback, useMemo } from 'react'
import { PDFDocument } from 'pdf-lib'
import { fileToBytes, mergePdfs, reorderPages, addTextAnnotations, editExistingTextInPdf } from '../services/pdfService'
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
    if (!mergedPdf) {
      console.warn('No PDF loaded for editing');
      return;
    }

    try {
      console.log('Starting text edit operation:', edit);

      // Validate input
      if (!edit.oldText || !edit.newText) {
        console.error('Invalid text edit parameters:', edit);
        throw new Error('Invalid text edit parameters');
      }

      console.log('Calling editExistingTextInPdf with:', {
        pageNumber: edit.pageNumber,
        oldText: edit.oldText,
        newText: edit.newText,
        x: edit.x,
        y: edit.y
      });

      const updatedPdfBytes = await editExistingTextInPdf(
        mergedPdf,
        edit.pageNumber,
        edit.oldText,
        edit.newText,
        edit.x,
        edit.y
      );

      // Verify the edit produced changes
      if (updatedPdfBytes.length === mergedPdf.length) {
        console.warn('Text edit did not produce byte-level changes');
      }

      console.log('PDF update successful, updating state');
      setMergedPdf(updatedPdfBytes);

      // Update annotations
      setAnnotations(prev => {
        const updated = prev.map(ann => {
          if (ann.pageNumber === edit.pageNumber &&
            ann.x !== undefined && ann.y !== undefined &&
            Math.abs(ann.x - edit.x) < 10 &&
            Math.abs(ann.y - edit.y) < 10 &&
            ann.text === edit.oldText) {
            console.log('Updating annotation:', { old: ann, new: edit.newText });
            return { ...ann, text: edit.newText };
          }
          return ann;
        });
        return updated;
      });

      console.log('Text edit operation completed successfully');
    } catch (error) {
      console.error('Text edit operation failed:', error);
      throw new Error(`Failed to edit text: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [mergedPdf])

  const updateOrder = useCallback((newOrder: number[]) => {
    setPageOrder(newOrder)
  }, [])

  const canExport = useMemo(() => Boolean(mergedPdf && numPages > 0), [mergedPdf, numPages])

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
