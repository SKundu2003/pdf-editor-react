import React, { useRef, useEffect, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
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
  const editorRef = useRef<any>(null)
  const [isEditorReady, setIsEditorReady] = useState(false)

  const handleEditorChange = (content: string) => {
    updateEditedContent(content)
  }

  const handleSave = () => {
    markAsSaved()
    addToast({
      title: 'Changes Saved',
      description: 'Your edits have been saved locally',
      variant: 'success'
    })
  }

  const handleUndo = () => {
    if (editorRef.current) {
      editorRef.current.execCommand('Undo')
    }
  }

  const handleRedo = () => {
    if (editorRef.current) {
      editorRef.current.execCommand('Redo')
    }
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
          case 'y':
            e.preventDefault()
            handleRedo()
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
          <Button variant="ghost" size="sm" onClick={handleUndo} disabled={!isEditorReady}>
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleRedo} disabled={!isEditorReady}>
            <Redo className="h-4 w-4" />
          </Button>
          
          <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-2" />
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" disabled={!isEditorReady}>
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" disabled={!isEditorReady}>
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" disabled={!isEditorReady}>
              <Underline className="h-4 w-4" />
            </Button>
          </div>

          <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-2" />

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" disabled={!isEditorReady}>
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" disabled={!isEditorReady}>
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" disabled={!isEditorReady}>
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

      {/* TinyMCE Editor */}
      <div className="flex-1 p-4">
        <Editor
          onInit={(evt, editor) => {
            editorRef.current = editor
            setIsEditorReady(true)
          }}
          initialValue={editedContent}
          onEditorChange={handleEditorChange}
          init={{
            height: '100%',
            menubar: false,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
              'textcolor', 'colorpicker'
            ],
            toolbar: false, // We use custom toolbar above
            content_style: `
              body { 
                font-family: Arial, sans-serif; 
                font-size: 14px; 
                line-height: 1.6;
                color: #374151;
                background: #ffffff;
                margin: 0;
                padding: 20px;
              }
              h1, h2, h3, h4, h5, h6 { 
                margin-top: 1em; 
                margin-bottom: 0.5em; 
                font-weight: 600;
              }
              p { 
                margin-bottom: 1em; 
              }
              ul, ol { 
                margin-bottom: 1em; 
                padding-left: 1.5em; 
              }
              blockquote {
                border-left: 4px solid #e5e7eb;
                padding-left: 1em;
                margin: 1em 0;
                font-style: italic;
                color: #6b7280;
              }
            `,
            skin: 'oxide',
            content_css: 'default',
            branding: false,
            resize: false,
            statusbar: false,
            elementpath: false,
            setup: (editor) => {
              editor.on('init', () => {
                setIsEditorReady(true)
              })
            }
          }}
        />
      </div>
    </div>
  )
}