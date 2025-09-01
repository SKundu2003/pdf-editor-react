import React, { useRef, useEffect, useState } from 'react'
import { Save, Type, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Quote, Palette, FileText } from 'lucide-react'
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
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize editor content when converted content is available
  useEffect(() => {
    if (convertedContent && convertedContent.html && editorRef.current && !isInitialized) {
      try {
        // Clean and sanitize the HTML content
        const cleanHtml = convertedContent.html
          .replace(/\n/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
        
        editorRef.current.innerHTML = cleanHtml
        updateEditedContent(cleanHtml)
        setIsInitialized(true)
        
        console.log('Editor initialized with HTML content')
      } catch (error) {
        console.error('Error initializing editor:', error)
        addToast({
          title: 'Editor Error',
          description: 'Failed to load content in editor',
          variant: 'destructive'
        })
      }
    }
  }, [convertedContent, isInitialized, updateEditedContent, addToast])

  // Reset initialization when content changes
  useEffect(() => {
    if (!convertedContent) {
      setIsInitialized(false)
    }
  }, [convertedContent])

  const handleContentChange = () => {
    if (editorRef.current && isInitialized) {
      try {
        const content = editorRef.current.innerHTML
        updateEditedContent(content)
      } catch (error) {
        console.error('Error updating content:', error)
      }
    }
  }

  const handleSave = () => {
    try {
      markAsSaved()
      addToast({
        title: 'Changes Saved',
        description: 'Your edits have been saved locally',
        variant: 'success'
      })
    } catch (error) {
      addToast({
        title: 'Save Error',
        description: 'Failed to save changes',
        variant: 'destructive'
      })
    }
  }

  const execCommand = (command: string, value?: string) => {
    try {
      document.execCommand(command, false, value)
      handleContentChange()
      editorRef.current?.focus()
    } catch (error) {
      console.error('Error executing command:', error)
    }
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
        case 'z':
          if (!e.shiftKey) {
            e.preventDefault()
            execCommand('undo')
          }
          break
        case 'y':
          e.preventDefault()
          execCommand('redo')
          break
      }
    }
  }

  if (!convertedContent) {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
              <Type className="h-8 w-8 text-slate-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">No Content to Edit</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Convert a PDF to HTML first to start editing
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          <span className="text-sm font-medium">Rich Text Editor</span>
        </div>
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              Unsaved
            </span>
          )}
          <Button size="sm" onClick={handleSave} disabled={!hasUnsavedChanges}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      {/* Formatting Toolbar */}
      <div className="flex items-center gap-2 p-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex-wrap flex-shrink-0">
        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => execCommand('bold')}
            className="hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => execCommand('italic')}
            className="hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => execCommand('underline')}
            className="hover:bg-slate-100 dark:hover:bg-slate-800"
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
            className="hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => execCommand('justifyCenter')}
            className="hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => execCommand('justifyRight')}
            className="hover:bg-slate-100 dark:hover:bg-slate-800"
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
            className="hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => execCommand('insertOrderedList')}
            className="hover:bg-slate-100 dark:hover:bg-slate-800"
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
          className="text-sm border border-slate-300 dark:border-slate-600 rounded px-2 py-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          title="Font Size"
        >
          <option value="1">Small</option>
          <option value="2">Medium</option>
          <option value="3">Normal</option>
          <option value="4">Large</option>
          <option value="5">X-Large</option>
        </select>

        {/* Text Color */}
        <div className="flex items-center gap-1">
          <Palette className="h-4 w-4 text-slate-500" />
          <input
            type="color"
            onChange={(e) => execCommand('foreColor', e.target.value)}
            className="w-8 h-8 border border-slate-300 dark:border-slate-600 rounded cursor-pointer"
            title="Text Color"
            defaultValue="#000000"
          />
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto p-4 min-h-0">
        <div
          ref={editorRef}
          contentEditable={isInitialized}
          onInput={handleContentChange}
          onKeyDown={handleKeyDown}
          className={cn(
            "min-h-full w-full p-6 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
            "prose prose-slate dark:prose-invert max-w-none",
            "[&>*]:mb-4 [&>h1]:text-2xl [&>h2]:text-xl [&>h3]:text-lg [&>h4]:text-base",
            "[&>p]:leading-relaxed [&>ul]:list-disc [&>ol]:list-decimal [&>ul]:ml-6 [&>ol]:ml-6",
            "[&>blockquote]:border-l-4 [&>blockquote]:border-slate-300 [&>blockquote]:pl-4 [&>blockquote]:italic",
            "[&>table]:border-collapse [&>table]:border [&>table]:border-slate-300",
            "[&>table>thead>tr>th]:border [&>table>thead>tr>th]:border-slate-300 [&>table>thead>tr>th]:p-2 [&>table>thead>tr>th]:bg-slate-50",
            "[&>table>tbody>tr>td]:border [&>table>tbody>tr>td]:border-slate-300 [&>table>tbody>tr>td]:p-2",
            "focus-within:shadow-sm transition-shadow duration-200"
          )}
          style={{
            minHeight: '400px',
            fontSize: '16px',
            lineHeight: '1.7',
            color: 'inherit'
          }}
          suppressContentEditableWarning={true}
        />
      </div>

      {/* Footer Help */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex-shrink-0">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          💡 <strong>Shortcuts:</strong> Ctrl+B (Bold), Ctrl+I (Italic), Ctrl+U (Underline), Ctrl+S (Save), Ctrl+Z (Undo)
        </p>
      </div>
    </div>
  )
}