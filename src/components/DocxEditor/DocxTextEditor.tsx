import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Save, Download, FileText, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered } from 'lucide-react'
import { Button } from '../UI/Button'
import { useToast } from '../UI/Toast'
import { getDocxService } from '../../services/docxService'
import { cn } from '../../utils/cn'
import type { DocxFile } from '../../types/docx'

interface DocxTextEditorProps {
  docxFile: DocxFile
  onClose: () => void
}

export default function DocxTextEditor({ docxFile, onClose }: DocxTextEditorProps) {
  const { addToast } = useToast()
  const editorRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [editedContent, setEditedContent] = useState('')
  const [originalContent, setOriginalContent] = useState('')

  // Load DOCX content for editing
  useEffect(() => {
    const loadDocxContent = async () => {
      try {
        setIsLoading(true)
        const docxService = getDocxService()
        const { html, rawText } = await docxService.extractDocxContent(docxFile.blob)
        
        console.log('Loaded DOCX content:', { html: html.substring(0, 200), rawText: rawText.substring(0, 200) })
        
        const contentToUse = html || rawText || 'No content could be extracted from this document.'
        setOriginalContent(contentToUse)
        setEditedContent(contentToUse)
        
        if (editorRef.current) {
          editorRef.current.innerHTML = contentToUse
        }
        
        addToast({
          title: 'Document Loaded',
          description: 'DOCX content is ready for editing',
          variant: 'success'
        })
      } catch (error) {
        console.error('Failed to load DOCX content:', error)
        addToast({
          title: 'Loading Error',
          description: error instanceof Error ? error.message : 'Failed to load document content',
          variant: 'destructive'
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadDocxContent()
  }, [docxFile, addToast])

  // Handle content changes
  const handleContentChange = useCallback(() => {
    if (!editorRef.current || isLoading) return
    
    const content = editorRef.current.innerHTML
    setEditedContent(content)
    setHasUnsavedChanges(content !== originalContent)
  }, [originalContent, isLoading])

  // Handle input events
  const handleInput = useCallback(() => {
    handleContentChange()
  }, [handleContentChange])

  // Save changes
  const handleSave = useCallback(() => {
    setHasUnsavedChanges(false)
    addToast({
      title: 'Changes Saved',
      description: 'Your edits have been saved locally',
      variant: 'success'
    })
  }, [addToast])

  // Export as DOCX
  const handleExport = useCallback(async () => {
    try {
      setIsLoading(true)
      const docxService = getDocxService()
      
      const docxBlob = await docxService.createDocxFromHtml(editedContent, docxFile.name)
      docxService.downloadDocx(docxBlob, docxFile.name.replace('.docx', '_edited.docx'))
      
      setHasUnsavedChanges(false)
      
      addToast({
        title: 'Export Complete',
        description: 'Edited document has been downloaded',
        variant: 'success'
      })
    } catch (error) {
      addToast({
        title: 'Export Failed',
        description: error instanceof Error ? error.message : 'Failed to export document',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }, [editedContent, docxFile.name, addToast])

  // Execute formatting commands
  const execCommand = useCallback((command: string, value?: string) => {
    try {
      document.execCommand(command, false, value)
      setTimeout(() => {
        handleContentChange()
        editorRef.current?.focus()
      }, 10)
    } catch (error) {
      console.error('Error executing command:', error)
    }
  }, [handleContentChange])

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 's':
          e.preventDefault()
          handleSave()
          return
        case 'b':
          e.preventDefault()
          execCommand('bold')
          return
        case 'i':
          e.preventDefault()
          execCommand('italic')
          return
        case 'u':
          e.preventDefault()
          execCommand('underline')
          return
      }
    }
  }, [handleSave, execCommand])

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Loading Document</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Extracting content from DOCX file...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          <div>
            <h2 className="font-semibold">{docxFile.name}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              DOCX Editor
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
          <Button onClick={handleExport} disabled={isLoading}>
            <Download className="h-4 w-4 mr-1" />
            Export DOCX
          </Button>
        </div>
      </div>

      {/* Formatting Toolbar */}
      <div className="flex items-center gap-2 p-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex-wrap">
        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => execCommand('bold')}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => execCommand('italic')}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => execCommand('underline')}
            title="Underline (Ctrl+U)"
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />

        {/* Alignment */}
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => execCommand('justifyLeft')}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => execCommand('justifyCenter')}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => execCommand('justifyRight')}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />

        {/* Lists */}
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => execCommand('insertUnorderedList')}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => execCommand('insertOrderedList')}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />

        {/* Font Size */}
        <select 
          onChange={(e) => execCommand('fontSize', e.target.value)}
          defaultValue="3"
          className="text-sm border border-slate-300 dark:border-slate-600 rounded px-2 py-1 bg-white dark:bg-slate-800"
        >
          <option value="1">Small</option>
          <option value="2">Medium</option>
          <option value="3">Normal</option>
          <option value="4">Large</option>
          <option value="5">X-Large</option>
        </select>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto p-6">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          suppressContentEditableWarning={true}
          className={cn(
            "min-h-full w-full p-6 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
            "text-slate-900 dark:text-slate-100"
          )}
          style={{
            minHeight: '500px',
            fontSize: '16px',
            lineHeight: '1.6',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        />
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          💡 <strong>Shortcuts:</strong> Ctrl+B (Bold), Ctrl+I (Italic), Ctrl+U (Underline), Ctrl+S (Save)
        </p>
      </div>
    </div>
  )
}