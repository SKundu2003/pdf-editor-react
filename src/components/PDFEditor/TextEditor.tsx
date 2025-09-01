import React, { useRef, useEffect, useState } from 'react'
import { Save, Undo, Redo, Type, Palette, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from 'lucide-react'
import { Button } from '../UI/Button'
import { useEditorStore } from '../../store/editorStore'
import { useToast } from '../UI/Toast'
import { cn } from '../../utils/cn'

export default function TextEditor() {
  const { 
    convertedContent, 
    editedContent, 
    hasUnsavedChanges, 
    updateEditedContent, 
    markAsSaved 
  } = useEditorStore()
  const { addToast } = useToast()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [content, setContent] = useState('')

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value
    setContent(content)
    updateEditedContent(content)
  }

  // Update editor content when converted content changes
  useEffect(() => {
    if (convertedContent) {
      setContent(convertedContent.html)
      updateEditedContent(convertedContent.html)
    }
  }, [convertedContent, updateEditedContent])

  const handleSave = () => {
    markAsSaved()
    addToast({
      title: 'Changes Saved',
      description: 'Your edits have been saved locally',
      variant: 'success'
    })
  }

  const handleUndo = () => {
    // Basic undo functionality can be added here
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault()
            handleSave()
            break
          case 'z':
            if (!e.shiftKey) {
              e.preventDefault()
              handleUndo()
            }
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!convertedContent) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
            <Type className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-slate-600 dark:text-slate-400">Convert PDF to start editing</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleUndo}>
            <Undo className="h-4 w-4" />
          </Button>
          
          <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-2" />
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm">
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Underline className="h-4 w-4" />
            </Button>
          </div>

          <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-2" />

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm">
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <span className="text-xs text-amber-600 dark:text-amber-400">Unsaved changes</span>
          )}
          <Button size="sm" onClick={handleSave} disabled={!hasUnsavedChanges}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      {/* HTML Content Editor */}
      <div className="flex-1 p-4">
        <div className="h-full flex gap-4">
          {/* HTML Source Editor */}
          <div className="flex-1 flex flex-col">
            <h4 className="text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">HTML Source</h4>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              className="flex-1 w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="HTML content will appear here after conversion..."
            />
          </div>
          
          {/* HTML Preview */}
          <div className="flex-1 flex flex-col">
            <h4 className="text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Preview</h4>
            <div 
              className="flex-1 p-4 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 overflow-auto"
              dangerouslySetInnerHTML={{ __html: content }}
              style={{
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#374151'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}