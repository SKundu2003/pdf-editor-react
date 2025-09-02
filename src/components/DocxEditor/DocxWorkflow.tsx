import React, { useState } from 'react'
import { ArrowLeft, FileText } from 'lucide-react'
import { Button } from '../UI/Button'
import DocxUploader from './DocxUploader'
import DocxTextEditor from './DocxTextEditor'
import type { DocxFile } from '../../types/docx'

export default function DocxWorkflow() {
  const [currentDocx, setCurrentDocx] = useState<DocxFile | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const handleDocxReady = (docxFile: DocxFile) => {
    setCurrentDocx(docxFile)
  }

  const handleEditDocx = (docxFile: DocxFile) => {
    setCurrentDocx(docxFile)
    setIsEditing(true)
  }

  const handleCloseEditor = () => {
    setIsEditing(false)
  }

  const handleBackToUpload = () => {
    setCurrentDocx(null)
    setIsEditing(false)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
        <div className="flex items-center gap-3">
          {(currentDocx || isEditing) && (
            <Button variant="ghost" size="sm" onClick={handleBackToUpload}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary-600" />
            <h1 className="text-xl font-bold">PDF to DOCX Converter</h1>
          </div>
        </div>
        
        {currentDocx && (
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Current: {currentDocx.name}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-hidden">
        {!isEditing ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Convert PDF to DOCX</h2>
              <p className="text-slate-600 dark:text-slate-400">
                Upload your PDF files and convert them to editable DOCX documents
              </p>
            </div>
            
            <DocxUploader 
              onDocxReady={handleDocxReady}
              onEditDocx={handleEditDocx}
            />
          </div>
        ) : currentDocx ? (
          <DocxTextEditor 
            docxFile={currentDocx}
            onClose={handleCloseEditor}
          />
        ) : null}
      </div>
    </div>
  )
}