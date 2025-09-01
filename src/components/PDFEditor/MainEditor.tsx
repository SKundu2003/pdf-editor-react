import React, { useState, useCallback } from 'react'
import { FileText, Download, RefreshCw, Settings, Layers } from 'lucide-react'
import { Button } from '../UI/Button'
import { useToast } from '../UI/Toast'
import { useEditorStore } from '../../store/editorStore'
import { getPDFService, initializePDFService, isPDFServiceConfigured } from '../../services/pdfService'
import { downloadBytesAsFile } from '../../utils/download'
import PDFUploader from './PDFUploader'
import PDFPreview from './PDFPreview'
import TextEditor from './TextEditor'
import DocumentInfo from './DocumentInfo'
import PageReorder from './PageReorder'
import APIKeyDialog from './APIKeyDialog'
import ConversionProgress from './ConversionProgress'
import type { APIProgress } from '../../types/editor'

export default function MainEditor() {
  const {
    currentPdf,
    uploadedFiles,
    mergedPdf,
    convertedContent,
    editedContent,
    apiStatus,
    setConvertedContent,
    setApiStatus,
    markAsSaved
  } = useEditorStore()
  
  const { addToast } = useToast()
  const [showApiDialog, setShowApiDialog] = useState(false)
  const [apiProgress, setApiProgress] = useState<APIProgress | null>(null)
  const [isApiConfigured, setIsApiConfigured] = useState(true)

  const handleApiKeySubmit = useCallback(() => {
    try {
      initializePDFService()
      setIsApiConfigured(true)
      addToast({
        title: 'API Configured',
        description: 'PDF Service is ready to use',
        variant: 'success'
      })
    } catch (error) {
      addToast({
        title: 'Configuration Error',
        description: error instanceof Error ? error.message : 'Failed to configure PDF Service',
        variant: 'destructive'
      })
    }
  }, [addToast])

  const handleConvertToHtml = useCallback(async () => {
    if (!currentPdf) {
      addToast({
        title: 'No PDF Selected',
        description: 'Please select a PDF file to convert',
        variant: 'destructive'
      })
      return
    }
    
    setApiStatus('converting')
    
    try {
      // Initialize PDF Service
      initializePDFService()
      
      const service = getPDFService()
      
      let fileToConvert: File
      if ('file' in currentPdf) {
        fileToConvert = currentPdf.file
      } else if ('bytes' in currentPdf && currentPdf.bytes) {
        fileToConvert = new File([currentPdf.bytes], currentPdf.name, { type: 'application/pdf' })
      } else {
        throw new Error('No valid PDF file found')
      }
      
      const content = await service.convertPdfToHtml(fileToConvert, (progress) => setApiProgress(progress))
      
      console.log('Received content from API:', content)
      
      setConvertedContent(content)
      setApiStatus('idle')
      setApiProgress(null)
      
      addToast({
        title: 'Conversion Complete',
        description: 'PDF has been converted to HTML for editing',
        variant: 'success'
      })
    } catch (error) {
      setApiStatus('error', error instanceof Error ? error.message : 'Conversion failed')
      setApiProgress(null)
      
      addToast({
        title: 'Conversion Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive'
      })
    }
  }, [currentPdf, isApiConfigured, setApiStatus, setConvertedContent, addToast])

  const handleExportPdf = useCallback(async () => {
    if (!convertedContent || !editedContent || !currentPdf) return

    setApiStatus('generating')
    
    try {
      const service = getPDFService()
      const pdfBytes = await service.convertHtmlToPdf(
        editedContent,
        convertedContent.originalStructure,
        (progress) => setApiProgress(progress)
      )
      
      const filename = currentPdf.name.replace('.pdf', '_edited.pdf')
      downloadBytesAsFile(pdfBytes, filename)
      
      markAsSaved()
      setApiStatus('idle')
      setApiProgress(null)
      
      addToast({
        title: 'Export Complete',
        description: `"${filename}" has been downloaded`,
        variant: 'success'
      })
    } catch (error) {
      setApiStatus('error', error instanceof Error ? error.message : 'Export failed')
      setApiProgress(null)
      
      addToast({
        title: 'Export Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive'
      })
    }
  }, [convertedContent, editedContent, currentPdf, setApiStatus, markAsSaved, addToast])

  return (
    <div className="h-full flex flex-col">
      {/* Main Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">PDF Editor</h1>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Layers className="h-4 w-4" />
            {uploadedFiles.length > 0 && `${uploadedFiles.length} file(s)`}
            {currentPdf && (
              <>
                <span>•</span>
                <FileText className="h-4 w-4" />
                <span>{currentPdf.name}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowApiDialog(true)}
          >
            <Settings className="h-4 w-4 mr-1" />
            API Settings
          </Button>

          {currentPdf && !convertedContent && (
            <Button
              onClick={handleConvertToHtml}
              disabled={apiStatus !== 'idle'}
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Convert to HTML
            </Button>
          )}

          {convertedContent && (
            <Button
              onClick={handleExportPdf}
              disabled={apiStatus !== 'idle'}
              size="sm"
            >
              <Download className="h-4 w-4 mr-1" />
              Export PDF
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[260px,1fr] lg:grid-cols-[320px,280px,1fr,1fr] gap-4 p-4 overflow-hidden min-h-0">
        {/* Sidebar */}
        <aside className="space-y-4 overflow-auto min-h-0">
          <PDFUploader />
          <DocumentInfo />
        </aside>

        {/* Page Reorder Panel */}
        <aside className="space-y-4 overflow-auto min-h-0 hidden lg:block">
          <PageReorder />
        </aside>

        {/* PDF Preview */}
        <div className="min-h-0 hidden md:block">
          <PDFPreview />
        </div>

        {/* Text Editor */}
        <div className="min-h-0 col-span-1 md:col-span-1 lg:col-span-1">
          <TextEditor />
        </div>
      </div>

      {/* Dialogs and Overlays */}
      <APIKeyDialog
        isOpen={showApiDialog}
        onClose={() => setShowApiDialog(false)}
        onSubmit={handleApiKeySubmit}
      />

      {apiProgress && (
        <ConversionProgress
          progress={apiProgress}
          isVisible={apiStatus === 'converting' || apiStatus === 'generating'}
        />
      )}
    </div>
  )
}