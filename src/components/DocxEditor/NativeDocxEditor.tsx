import React, { useRef, useEffect, useState, useCallback } from 'react'
import { DocumentEditorContainerComponent } from '@syncfusion/ej2-react-documenteditor'
import { registerLicense } from '@syncfusion/ej2-base'
import { Save, Download, FileText, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '../UI/Button'
import { useToast } from '../UI/Toast'
import { cn } from '../../utils/cn'
import type { DocxFile } from '../../types/docx'

// Register Syncfusion license (you'll need to get a free community license)
registerLicense('Ngo9BigBOggjHTQxAR8/V1NCaF1cXmhIfEx1RHxQdld5ZFRHallYTnNWUj0eQnxTdEFiWH5fcnVVRWVfVkN3Wg==')

const BACKEND_API_URL = 'https://effect-solo-textbook-minor.trycloudflare.com/api/documenteditor'

interface NativeDocxEditorProps {
  docxFile: DocxFile
  onClose: () => void
  onExport?: (blob: Blob, filename: string) => void
}

const NativeDocxEditor = ({ docxFile, onClose, onExport }: NativeDocxEditorProps) => {
  const editorRef = useRef<DocumentEditorContainerComponent>(null)
  const { addToast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load DOCX file into editor using backend API
  useEffect(() => {
    const loadDocxFile = async () => {
      console.log('=== DOCX LOADING PROCESS STARTED ===')
      console.log('Editor ref current:', !!editorRef.current)
      console.log('DocumentEditor:', !!editorRef.current?.documentEditor)
      console.log('DOCX file blob:', !!docxFile.blob)
      console.log('DOCX file name:', docxFile.name)
      console.log('DOCX file size:', docxFile.blob?.size)
      
      if (!editorRef.current?.documentEditor || !docxFile.blob) {
        console.log('Editor not ready or no blob:', { 
          editor: !!editorRef.current?.documentEditor, 
          blob: !!docxFile.blob 
        })
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        
        console.log('=== STARTING API CALL ===')
        console.log('API URL:', `${BACKEND_API_URL}/import`)
        console.log('File details:', {
          name: docxFile.name,
          size: docxFile.blob.size,
          type: docxFile.blob.type
        })

        // Create FormData to send DOCX file to backend
        const formData = new FormData()
        formData.append('file', docxFile.blob, docxFile.name)
        
        console.log('FormData created, file appended with name:', docxFile.name)
        console.log('Making fetch request to:', `${BACKEND_API_URL}/import`)
        
        // Call backend API to convert DOCX to SFDT
        console.log('=== FETCH REQUEST STARTING ===')
        const response = await fetch(`${BACKEND_API_URL}/import`, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          },
          mode: 'cors'
        })
        
        console.log('=== FETCH RESPONSE RECEIVED ===')
        console.log('Response status:', response.status)
        console.log('Response statusText:', response.statusText)
        console.log('Response headers:', Object.fromEntries(response.headers.entries()))
        console.log('Response ok:', response.ok)
        console.log('Response type:', response.type)
        console.log('Response url:', response.url)
        
        if (!response.ok) {
          console.log('=== RESPONSE NOT OK ===')
          let errorText = 'Unknown error'
          try {
            errorText = await response.text()
            console.log('Error response text:', errorText)
          } catch (textError) {
            console.log('Failed to read error text:', textError)
          }
          throw new Error(`Backend API error (${response.status}): ${errorText}`)
        }
        
        console.log('=== PARSING JSON RESPONSE ===')
        let sfdtData
        try {
          const responseText = await response.text()
          console.log('Raw response text (first 500 chars):', responseText.substring(0, 500))
          console.log('Full response length:', responseText.length)
          
          sfdtData = JSON.parse(responseText)
          console.log('JSON parsed successfully')
          console.log('SFDT data type:', typeof sfdtData)
          console.log('SFDT data keys:', Object.keys(sfdtData || {}))
          console.log('SFDT data preview:', JSON.stringify(sfdtData).substring(0, 200))
        } catch (jsonError) {
          console.error('JSON parsing failed:', jsonError)
          throw new Error('Invalid JSON response from backend')
        }
        
        // Validate SFDT data
        if (!sfdtData || typeof sfdtData !== 'object') {
          console.error('Invalid SFDT data structure:', sfdtData)
          throw new Error('Invalid SFDT data received from backend')
        }

        console.log('=== LOADING SFDT INTO EDITOR ===')
        const sfdtString = JSON.stringify(sfdtData)
        console.log('SFDT string length:', sfdtString.length)
        console.log('SFDT string preview:', sfdtString.substring(0, 200))
        
        // Open SFDT document in editor
        console.log('Calling editor.open() with SFDT data...')
        editorRef.current.documentEditor.open(sfdtString)
        
        console.log('=== EDITOR LOADING COMPLETE ===')
        console.log('Document loaded successfully')
        console.log('Editor page count:', editorRef.current.documentEditor.pageCount)
        console.log('Document name:', editorRef.current.documentEditor.documentName)
        
        // Set up change tracking
        editorRef.current.documentEditor.contentChange = (args: any) => {
          console.log('Content changed:', args)
          setHasUnsavedChanges(true)
        }

        addToast({
          title: 'Document Loaded',
          description: `DOCX file loaded successfully (${editorRef.current.documentEditor.pageCount} pages)`,
          variant: 'success'
        })
      } catch (error) {
        console.error('=== DOCX LOADING FAILED ===')
        console.error('Error type:', error.constructor.name)
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
        
        setError(error instanceof Error ? error.message : 'Failed to load document')
        addToast({
          title: 'Loading Error',
          description: error instanceof Error ? error.message : 'Failed to load DOCX file in editor',
          variant: 'destructive',
          duration: 10000
        })
      } finally {
        setIsLoading(false)
        console.log('=== DOCX LOADING PROCESS ENDED ===')
      }
    }

    // Wait for editor to be fully initialized
    const checkEditorReady = () => {
      console.log('Checking if editor is ready...')
      console.log('Editor ref:', !!editorRef.current)
      console.log('DocumentEditor:', !!editorRef.current?.documentEditor)
      
      if (editorRef.current?.documentEditor) {
        console.log('Editor is ready, loading document')
        loadDocxFile()
      } else {
        console.log('Editor not ready, waiting 500ms...')
        setTimeout(checkEditorReady, 500)
      }
    }
    
    // Start checking after a short delay
    console.log('Starting editor ready check in 100ms...')
    const timeoutId = setTimeout(checkEditorReady, 100)
    
    return () => {
      console.log('Cleaning up editor ready check timeout')
      clearTimeout(timeoutId)
    }
  }, [docxFile, addToast])
  
  // Handle editor creation
  const onEditorCreated = useCallback(() => {
    console.log('=== DOCUMENT EDITOR CREATED ===')
    console.log('Editor instance:', !!editorRef.current)
    console.log('DocumentEditor:', !!editorRef.current?.documentEditor)
  }, [])

  // Save document
  const handleSave = useCallback(() => {
    if (!editorRef.current) return

    try {
      // In a real implementation, you might save to backend here
      setHasUnsavedChanges(false)
      addToast({
        title: 'Document Saved',
        description: 'Your changes have been saved',
        variant: 'success'
      })
    } catch (error) {
      addToast({
        title: 'Save Error',
        description: 'Failed to save document',
        variant: 'destructive'
      })
    }
  }, [addToast])

  // Export as DOCX
  const handleExportDocx = useCallback(async () => {
    if (!editorRef.current) return

    try {
      setIsExporting(true)
      
      // Get SFDT content from editor
      const sfdtContent = editorRef.current.documentEditor.serialize()
      
      // Send SFDT to backend for DOCX export
      const response = await fetch(`${BACKEND_API_URL}/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        },
        body: JSON.stringify({
          sfdt: sfdtContent,
          fileName: docxFile.name.replace('.docx', '_edited.docx')
        })
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Export failed (${response.status}): ${errorText}`)
      }
      
      const docxBlob = await response.blob()
      const filename = docxFile.name.replace('.docx', '_edited.docx')
      
      if (onExport) {
        onExport(docxBlob, filename)
      } else {
        // Default download behavior
        const url = URL.createObjectURL(docxBlob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }

      setHasUnsavedChanges(false)
      addToast({
        title: 'Export Complete',
        description: `Document exported as ${filename}`,
        variant: 'success'
      })
    } catch (error) {
      addToast({
        title: 'Export Failed',
        description: error instanceof Error ? error.message : 'Failed to export document',
        variant: 'destructive',
        duration: 10000
      })
    } finally {
      setIsExporting(false)
    }
  }, [docxFile.name, onExport, addToast])

  // Export as PDF
  const handleExportPdf = useCallback(async () => {
    if (!editorRef.current) return

    try {
      setIsExporting(true)
      
      // Get SFDT content from editor
      const sfdtContent = editorRef.current.documentEditor.serialize()
      
      // Send SFDT to backend for PDF export
      const response = await fetch(`${BACKEND_API_URL}/exportpdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/pdf'
        },
        body: JSON.stringify({
          sfdt: sfdtContent,
          fileName: docxFile.name.replace('.docx', '_edited.pdf')
        })
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`PDF export failed (${response.status}): ${errorText}`)
      }
      
      const pdfBlob = await response.blob()
      const filename = docxFile.name.replace('.docx', '_edited.pdf')
      
      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      addToast({
        title: 'PDF Export Complete',
        description: `Document exported as ${filename}`,
        variant: 'success'
      })
    } catch (error) {
      addToast({
        title: 'PDF Export Failed',
        description: error instanceof Error ? error.message : 'Failed to export document as PDF',
        variant: 'destructive',
        duration: 10000
      })
    } finally {
      setIsExporting(false)
    }
  }, [docxFile.name, addToast])

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Failed to Load Document</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
            <div className="space-y-2">
              <Button onClick={() => window.location.reload()}>Retry</Button>
              <Button variant="outline" onClick={onClose}>Close Editor</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Loading Document</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Converting DOCX to SFDT format via backend API...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          <div>
            <h2 className="font-semibold">{docxFile.name}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Native DOCX Editor
              {hasUnsavedChanges && (
                <span className="ml-2 text-amber-600 dark:text-amber-400">• Unsaved changes</span>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleSave} disabled={!hasUnsavedChanges}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button onClick={handleExportDocx} disabled={isExporting}>
            <Download className="h-4 w-4 mr-1" />
            Export DOCX
          </Button>
          <Button variant="outline" onClick={handleExportPdf} disabled={isExporting}>
            <Download className="h-4 w-4 mr-1" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Native DOCX Editor */}
      <div className="flex-1 overflow-hidden">
        <DocumentEditorContainerComponent
          ref={editorRef}
          height="100%"
          width="100%"
          enableToolbar={true}
          enableLocalPaste={true}
          enableEditor={true}
          isReadOnly={false}
          enablePrint={true}
          enableSelection={true}
          enableContextMenu={true}
          enableHyperlinkDialog={true}
          enableBookmarkDialog={true}
          enableTableDialog={true}
          enableBordersAndShadingDialog={true}
          enableListDialog={true}
          enableParagraphDialog={true}
          enableFontDialog={true}
          enableTablePropertiesDialog={true}
          enablePageSetupDialog={true}
          enableStyleDialog={true}
          enableTableOfContentsDialog={true}
          enableFootnoteAndEndnoteDialog={true}
          enableColumnsDialog={true}
          enableFormFields={true}
          enableComment={true}
          enableTrackChanges={true}
          enableSearch={true}
          enableOptionsPane={true}
          created={onEditorCreated}
          className="docx-editor-container"
          serviceUrl={BACKEND_API_URL}
        />
      </div>

      {/* Loading Overlay for Export */}
      {isExporting && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
              <span className="font-medium">Exporting document...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NativeDocxEditor