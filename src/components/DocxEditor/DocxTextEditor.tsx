import React, { useState } from 'react'
import { FileText, Zap } from 'lucide-react'
import { Button } from '../UI/Button'
import NativeDocxEditor from './NativeDocxEditor'
import type { DocxFile } from '../../types/docx'

interface DocxTextEditorProps {
  docxFile: DocxFile
  onClose: () => void
}

export default function DocxTextEditor({ docxFile, onClose }: DocxTextEditorProps) {
  const [useNativeEditor, setUseNativeEditor] = useState(true)

  // Use native DOCX editor for better formatting preservation
  if (useNativeEditor) {
    return <NativeDocxEditor docxFile={docxFile} onClose={onClose} />
  }

  // Fallback option selector (in case native editor fails)
  return (
    <div className="h-full flex items-center justify-center bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
          <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Choose Editor Type</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Select how you'd like to edit your DOCX document
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={() => setUseNativeEditor(true)}
              className="w-full"
            >
              <Zap className="h-4 w-4 mr-2" />
              Native DOCX Editor (Recommended)
            </Button>
            
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Preserves full formatting, supports all DOCX features
            </p>
          </div>
        </div>
        
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  )
}