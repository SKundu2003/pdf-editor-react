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

interface NativeDocxEditorProps {
  docxFile: DocxFile
  onClose: () => void
  onExport?: (blob: Blob, filename: string) => void
}

export default function NativeDocxEditor({ docxFile, onClose, onExport }: NativeDocxEditorProps) {
  const editorRef = useRef<DocumentEditorContainerComponent>(null)
  const { addToast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load DOCX file into editor
  useEffect(() => {
    const loadDocxFile = async () => {
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
        
        console.log('Loading DOCX file:', docxFile.name, 'Size:', docxFile.blob.size)

        // Convert blob to base64 for Syncfusion editor
        const arrayBuffer = await docxFile.blob.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)
        
        // Convert to base64 properly
        let binary = ''
        const chunkSize = 8192
        for (let i = 0; i < uint8Array.length; i += chunkSize) {
          const chunk = uint8Array.subarray(i, i + chunkSize)
          binary += String.fromCharCode.apply(null, Array.from(chunk))
        }
        const base64String = btoa(binary)
        
        console.log('Base64 conversion complete, length:', base64String.length)

        // Open document in editor
        editorRef.current.documentEditor.open(base64String, 'Docx')
        
        console.log('Document opened in editor')
        
        // Set up change tracking
        editorRef.current.documentEditor.contentChange = (args: any) => {
          console.log('Content changed:', args)
          setHasUnsavedChanges(true)
        }

        addToast({
          title: 'Document Loaded',
          description: 'DOCX file loaded successfully with full formatting',
          variant: 'success'
        })
      } catch (error) {
        console.error('Failed to load DOCX file:', error)
        console.error('Error details:', error)
        setError(error instanceof Error ? error.message : 'Failed to load document')
        addToast({
          title: 'Loading Error',
          description: 'Failed to load DOCX file in editor',
          variant: 'destructive'
        })
      } finally {
        setIsLoading(false)
      }
    }

    // Wait for editor to be fully initialized
    const checkEditorReady = () => {
      if (editorRef.current?.documentEditor) {
        console.log('Editor is ready, loading document')
        loadDocxFile()
      } else {
        console.log('Editor not ready, waiting...')
        setTimeout(checkEditorReady, 500)
      }
    }
    
    // Start checking after a short delay
    const timeoutId = setTimeout(checkEditorReady, 100)
    
    return () => {
      clearTimeout(timeoutId)
    }
  }, [docxFile, addToast])
  
  // Handle editor creation
  const onEditorCreated = useCallback(() => {
    console.log('DocumentEditor created and ready')
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
      
      // Export document as DOCX
      const docxBlob = await editorRef.current.documentEditor.saveAsBlob('Docx')
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
        description: 'Failed to export document',
        variant: 'destructive'
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
      
      // Export document as PDF
      const pdfBlob = await editorRef.current.documentEditor.saveAsBlob('Pdf')
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
        description: 'Failed to export document as PDF',
        variant: 'destructive'
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
            <Button onClick={onClose}>Close Editor</Button>
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
              Initializing DOCX editor with full formatting...
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
          serviceUrl="https://effect-solo-textbook-minor.trycloudflare.com/api/documenteditor/"

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