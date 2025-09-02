import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, AlertCircle, X, Download, Edit3 } from 'lucide-react'
import { Button } from '../UI/Button'
import { Progress } from '../UI/Progress'
import { useToast } from '../UI/Toast'
import { getDocxService } from '../../services/docxService'
import { cn } from '../../utils/cn'
import type { DocxFile, DocxConversionProgress } from '../../types/docx'

interface DocxUploaderProps {
  onDocxReady: (docxFile: DocxFile) => void
  onEditDocx: (docxFile: DocxFile) => void
}

export default function DocxUploader({ onDocxReady, onEditDocx }: DocxUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<DocxFile[]>([])
  const [conversionProgress, setConversionProgress] = useState<DocxConversionProgress | null>(null)
  const { addToast } = useToast()

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(({ file, errors }) => {
        const errorMessages = errors.map((e: any) => {
          switch (e.code) {
            case 'file-invalid-type':
              return `"${file.name}" is not a PDF file`
            case 'file-too-large':
              return `"${file.name}" is too large (max 10MB)`
            default:
              return `"${file.name}" was rejected`
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

    // Process accepted files
    for (const file of acceptedFiles) {
      await handlePdfUpload(file)
    }
  }, [addToast])

  const handlePdfUpload = async (pdfFile: File) => {
    const docxFile: DocxFile = {
      id: Math.random().toString(36).substring(2, 9),
      name: pdfFile.name.replace('.pdf', '.docx'),
      size: pdfFile.size,
      blob: new Blob(), // Will be set after conversion
      status: 'uploading',
      uploadProgress: 0,
      conversionProgress: 0
    }

    setUploadedFiles(prev => [...prev, docxFile])

    try {
      const docxService = getDocxService()
      
      const docxBlob = await docxService.convertPdfToDocx(pdfFile, (progress) => {
        setConversionProgress(progress)
        
        // Update file progress
        setUploadedFiles(prev => prev.map(f => 
          f.id === docxFile.id 
            ? { 
                ...f, 
                status: progress.stage === 'complete' ? 'ready' : 'converting',
                conversionProgress: progress.progress 
              }
            : f
        ))
      })

      // Update file with converted blob
      const updatedFile: DocxFile = {
        ...docxFile,
        blob: docxBlob,
        status: 'ready',
        conversionProgress: 100
      }

      setUploadedFiles(prev => prev.map(f => 
        f.id === docxFile.id ? updatedFile : f
      ))

      setConversionProgress(null)
      onDocxReady(updatedFile)

      addToast({
        title: 'Conversion Complete',
        description: `"${pdfFile.name}" has been converted to DOCX format`,
        variant: 'success'
      })
    } catch (error) {
      setUploadedFiles(prev => prev.map(f => 
        f.id === docxFile.id 
          ? { 
              ...f, 
              status: 'error', 
              error: error instanceof Error ? error.message : 'Conversion failed' 
            }
          : f
      ))

      setConversionProgress(null)

      addToast({
        title: 'Conversion Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
        duration: 10000
      })
    }
  }

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id))
  }

  const downloadDocx = (file: DocxFile) => {
    const docxService = getDocxService()
    docxService.downloadDocx(file.blob, file.name)
    
    addToast({
      title: 'Download Started',
      description: `"${file.name}" is being downloaded`,
      variant: 'success'
    })
  }

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024 // 10MB
  })

  return (
    <div className="space-y-6">
      {/* Upload Area */}
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
              {!isDragActive && !isDragReject && 'Convert PDF to DOCX'}
            </h3>
            
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              {isDragReject 
                ? 'Please upload valid PDF files only (max 10MB)'
                : 'Drag and drop your PDF files here, or click to browse'
              }
            </p>
            
            <Button variant="outline" size="sm">
              Choose PDF Files
            </Button>
          </div>
          
          <div className="text-xs text-slate-500 dark:text-slate-400">
            PDF format only • Max 10MB per file • Multiple files supported
          </div>
        </div>
      </div>

      {/* Conversion Progress */}
      {conversionProgress && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
              <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100">
                {conversionProgress.stage === 'uploading' && 'Uploading PDF...'}
                {conversionProgress.stage === 'converting' && 'Converting to DOCX...'}
                {conversionProgress.stage === 'processing' && 'Processing Document...'}
                {conversionProgress.stage === 'complete' && 'Conversion Complete!'}
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {conversionProgress.message}
              </p>
            </div>
          </div>
          <Progress value={conversionProgress.progress} className="h-2" />
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
            {conversionProgress.progress}% complete
          </p>
        </div>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold">Converted Documents</h3>
          
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
            >
              {/* File Icon */}
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                file.status === 'ready' && "bg-green-100 dark:bg-green-900/30",
                file.status === 'error' && "bg-red-100 dark:bg-red-900/30",
                (file.status === 'uploading' || file.status === 'converting') && "bg-blue-100 dark:bg-blue-900/30"
              )}>
                <FileText className={cn(
                  "h-5 w-5",
                  file.status === 'ready' && "text-green-600 dark:text-green-400",
                  file.status === 'error' && "text-red-600 dark:text-red-400",
                  (file.status === 'uploading' || file.status === 'converting') && "text-blue-600 dark:text-blue-400"
                )} />
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate" title={file.name}>
                  {file.name}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                  {file.status === 'ready' && ' • Ready for editing'}
                  {file.status === 'converting' && ' • Converting...'}
                  {file.status === 'error' && ' • Conversion failed'}
                </p>
                
                {/* Progress Bar */}
                {(file.status === 'uploading' || file.status === 'converting') && (
                  <div className="mt-2">
                    <Progress value={file.conversionProgress} className="h-1" />
                  </div>
                )}
                
                {/* Error Message */}
                {file.status === 'error' && file.error && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 dark:text-red-400">
                    <AlertCircle className="h-3 w-3" />
                    <span className="text-xs">{file.error}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {file.status === 'ready' && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEditDocx(file)}
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => downloadDocx(file)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeFile(file.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}