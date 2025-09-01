import React, { useRef, useEffect, useState } from 'react'
import { Save, Undo, Redo, Type, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Quote } from 'lucide-react'
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
  const editorRef = useRef<HTMLDivElement>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Update editor content when converted content changes
  useEffect(() => {
    if (convertedContent && editorRef.current) {
      editorRef.current.innerHTML = convertedContent.html
      updateEditedContent(convertedContent.html)
      setIsEditing(true)
    }
  }, [convertedContent, updateEditedContent])

  const handleContentChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML
      updateEditedContent(content)
    }
  }

  const handleSave = () => {
    markAsSaved()
    addToast({
      title: 'Changes Saved',
      description: 'Your edits have been saved locally',
      variant: 'success'
    })
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    handleContentChange()
    editorRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 's':
          e.preventDefault()
          handleSave()
          break
        case 'b':
          e.preventDefault()
          execCommand('bold')
          break
        case 'i':
          e.preventDefault()
          execCommand('italic')
          break
        case 'u':
          e.preventDefault()
          execCommand('underline')
          break
      }
    }
  }

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
      <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => execCommand('bold')}
              className="hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => execCommand('italic')}
              className="hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => execCommand('underline')}
              className="hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <Underline className="h-4 w-4" />
            </Button>
          </div>

          <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-2" />

          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => execCommand('justifyLeft')}
              className="hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => execCommand('justifyCenter')}
              className="hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => execCommand('justifyRight')}
              className="hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-2" />

          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => execCommand('insertUnorderedList')}
              className="hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => execCommand('insertOrderedList')}
              className="hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => execCommand('formatBlock', 'blockquote')}
              className="hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <Quote className="h-4 w-4" />
            </Button>
          </div>

          <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-2" />

          <select 
            onChange={(e) => execCommand('fontSize', e.target.value)}
            className="text-sm border border-slate-300 dark:border-slate-600 rounded px-2 py-1 bg-white dark:bg-slate-800"
          >
            <option value="1">Small</option>
            <option value="3" selected>Normal</option>
            <option value="5">Large</option>
            <option value="7">Extra Large</option>
          </select>

          <input
            type="color"
            onChange={(e) => execCommand('foreColor', e.target.value)}
            className="w-8 h-8 border border-slate-300 dark:border-slate-600 rounded cursor-pointer"
            title="Text Color"
          />
        </div>

        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              Unsaved changes
            </span>
          )}
          <Button size="sm" onClick={handleSave} disabled={!hasUnsavedChanges}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      {/* Rich Text Editor */}
      <div className="flex-1 p-4 overflow-auto">
        <div
          ref={editorRef}
          contentEditable={isEditing}
          onInput={handleContentChange}
          onKeyDown={handleKeyDown}
          className={cn(
            "min-h-full w-full p-4 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500",
            "prose prose-slate dark:prose-invert max-w-none",
            "[&>*]:mb-4 [&>h1]:text-2xl [&>h2]:text-xl [&>h3]:text-lg",
            "[&>p]:leading-relaxed [&>ul]:list-disc [&>ol]:list-decimal",
            "[&>blockquote]:border-l-4 [&>blockquote]:border-slate-300 [&>blockquote]:pl-4 [&>blockquote]:italic"
          )}
          style={{
            minHeight: '500px',
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#374151'
          }}
        />
      </div>

      {/* Help Text */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          💡 Use Ctrl+B for bold, Ctrl+I for italic, Ctrl+U for underline, Ctrl+S to save
        </p>
      </div>
    </div>
  )
}