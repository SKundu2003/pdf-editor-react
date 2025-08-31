import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, AlertCircle, X } from 'lucide-react'
import { Button } from '../UI/Button'
import { Progress } from '../UI/Progress'
import { useToast } from '../UI/Toast'
import { useEditorStore } from '../../store/editorStore'
import { cn } from '../../utils/cn'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPTED_TYPES = ['application/pdf']

export default function PDFUploader() {
  const { currentPdf, uploadPdf, removePdf } = useEditorStore()
  const { addToast } = useToast()
  const [isDragActive, setIsDragActive] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    setIsDragActive(false)
    
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(({ file, errors }) => {
        const errorMessages = errors.map((e: any) => {
          switch (e.code) {
            case 'file-too-large':
              return `File "${file.name}" is too large (max 10MB)`
            case 'file-invalid-type':
              return `File "${file.name}" is not a PDF`
            default:
              return `File "${file.name}" was rejected`
          }
        })
        return errorMessages.join(', ')
      })
      
      addToast({
        title: 'Upload Error',
        description: errors.join('\n'),
        variant: 'destructive'
      })
      return
    }

    // Process accepted files (only take the first one for now)
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      try {
        await uploadPdf(file)
        addToast({
          title: 'PDF Uploaded',
          description: `"${file.name}" is ready for editing`,
          variant: 'success'
        })
      } catch (error) {
        addToast({
          title: 'Upload Failed',
          description: 'Failed to process PDF file',
          variant: 'destructive'
        })
      }
    }
  }, [uploadPdf, addToast])

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false
  })

  const handleRemove = () => {
    removePdf()
    addToast({
      title: 'PDF Removed',
      description: 'You can upload a new PDF to continue editing',
      variant: 'default'
    })
  }

  if (currentPdf) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">{currentPdf.name}</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {(currentPdf.size / 1024 / 1024).toFixed(1)} MB • {currentPdf.pageCount} pages
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleRemove}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {currentPdf.status === 'uploading' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading...</span>
              <span>{currentPdf.uploadProgress}%</span>
            </div>
            <Progress value={currentPdf.uploadProgress} />
          </div>
        )}

        {currentPdf.status === 'error' && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-300">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{currentPdf.error}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer',
        isDragActive && !isDragReject && 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20',
        isDragReject && 'border-red-500 bg-red-50/50 dark:bg-red-900/20',
        !isDragActive && !isDragReject && 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-50/50 dark:hover:bg-slate-800/50'
      )}
    >
      <input {...getInputProps()} />
      
      <div className="space-y-4">
        <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
          <Upload className={cn(
            'h-8 w-8 transition-colors',
            isDragActive && !isDragReject && 'text-primary-600',
            isDragReject && 'text-red-600',
            !isDragActive && !isDragReject && 'text-slate-500'
          )} />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">
            {isDragActive && !isDragReject && 'Drop your PDF here'}
            {isDragReject && 'Invalid file type'}
            {!isDragActive && !isDragReject && 'Upload PDF Document'}
          </h3>
          
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            {isDragReject 
              ? 'Please upload a valid PDF file'
              : 'Drag and drop your PDF file here, or click to browse'
            }
          </p>
          
          <Button variant="outline" size="sm">
            Choose File
          </Button>
        </div>
        
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Maximum file size: 10MB • PDF format only
        </div>
      </div>
    </div>
  )
}