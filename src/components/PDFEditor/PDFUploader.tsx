import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, AlertCircle, X, Merge, Trash2, CheckSquare, Square } from 'lucide-react'
import { Button } from '../UI/Button'
import { Progress } from '../UI/Progress'
import { useToast } from '../UI/Toast'
import { useEditorStore } from '../../store/editorStore'
import { DndContext, useDroppable, useDraggable } from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '../../utils/cn'

export default function PDFUploader() {
  const { 
    uploadedFiles, 
    selectedFiles, 
    mergedPdf,
    uploadPdfs, 
    removePdf, 
    removeAllPdfs,
    reorderFiles,
    toggleFileSelection,
    selectAllFiles,
    deselectAllFiles,
    mergeSelectedFiles,
    mergeSelectedFiles,
    generatePageOrder
  } = useEditorStore()
  const { addToast } = useToast()
  const [isDragActive, setIsDragActive] = useState(false)
  const [isMerging, setIsMerging] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    setIsDragActive(false)
    
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(({ file, errors }) => {
        const errorMessages = errors.map((e: any) => {
          switch (e.code) {
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

    // Process accepted files
    if (acceptedFiles.length > 0) {
      try {
        await uploadPdfs(acceptedFiles)
        addToast({
          title: 'PDFs Uploaded',
          description: `${acceptedFiles.length} file(s) uploaded successfully`,
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
  }, [uploadPdfs, addToast])

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true
  })

  const handleMergeSelected = async () => {
    if (selectedFiles.length < 2) {
      addToast({
        title: 'Selection Required',
        description: 'Please select at least 2 files to merge',
        variant: 'destructive'
      })
      return
    }
    
    setIsMerging(true)
    try {
      await mergeSelectedFiles()
      addToast({
        title: 'Files Merged',
        description: 'PDFs have been merged successfully',
        variant: 'success'
      })
    } catch (error) {
      addToast({
        title: 'Merge Failed',
        description: error instanceof Error ? error.message : 'Failed to merge files',
        variant: 'destructive'
      })
    } finally {
      setIsMerging(false)
    }
  }

  const handleRemoveAll = () => {
    removeAllPdfs()
    addToast({
      title: 'All Files Removed',
      description: 'You can upload new PDFs to continue',
      variant: 'default'
    })
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    
    if (active.id !== over?.id) {
      const oldIndex = uploadedFiles.findIndex(f => f.id === active.id)
      const newIndex = uploadedFiles.findIndex(f => f.id === over.id)
      reorderFiles(oldIndex, newIndex)
    }
  }

  if (uploadedFiles.length > 0) {
    return (
      <div className="space-y-4">
        {/* File Management Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={selectedFiles.length === uploadedFiles.length ? deselectAllFiles : selectAllFiles}
            >
              {selectedFiles.length === uploadedFiles.length ? (
                <CheckSquare className="h-4 w-4 mr-1" />
              ) : (
                <Square className="h-4 w-4 mr-1" />
              )}
              {selectedFiles.length > 0 ? `${selectedFiles.length} selected` : 'Select All'}
            </Button>
            
            {selectedFiles.length >= 2 && (
              <Button 
                size="sm" 
                onClick={handleMergeSelected}
                disabled={isMerging}
              >
                <Merge className="h-4 w-4 mr-1" />
                {isMerging ? 'Merging...' : 'Merge Selected'}
              </Button>
            )}
          </div>
          
          <Button variant="outline" size="sm" onClick={handleRemoveAll}>
            <Trash2 className="h-4 w-4 mr-1" />
            Remove All
          </Button>
        </div>

        {/* Merged PDF Display */}
        {mergedPdf && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Merge className="h-6 w-6 text-green-600 dark:text-green-400" />
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-100">{mergedPdf.name}</h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {mergedPdf.files.length} files merged • {mergedPdf.pageCount} total pages
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {mergedPdf.status === 'ready' && (
                  <Button size="sm" onClick={() => setCurrentPdf(mergedPdf)}>
                    Edit Merged PDF
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => set({ mergedPdf: null })}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {mergedPdf.status === 'merging' && (
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Merging files...</span>
                </div>
                <Progress value={50} />
              </div>
            )}
          </div>
        )}

        {/* File List */}
        <div className="space-y-2 max-h-96 overflow-auto">
          <DndContext onDragEnd={handleDragEnd}>
            <SortableContext items={uploadedFiles.map(f => f.id)} strategy={verticalListSortingStrategy}>
              {uploadedFiles.map((file, index) => (
                <FileItem
                  key={file.id}
                  file={file}
                  index={index}
                  isSelected={selectedFiles.includes(file.id)}
                  onToggleSelect={() => toggleFileSelection(file.id)}
                  onRemove={() => removePdf(file.id)}
                  onEdit={() => setCurrentPdf(file)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        {/* Upload More Button */}
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 text-center hover:border-slate-400 dark:hover:border-slate-600 cursor-pointer transition-colors"
        >
          <input {...getInputProps()} />
          <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
            <Upload className="h-4 w-4" />
            <span className="text-sm">Add more PDFs</span>
          </div>
        </div>
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
            {isDragActive && !isDragReject && 'Drop your PDFs here'}
            {isDragReject && 'Invalid file type'}
            {!isDragActive && !isDragReject && 'Upload PDF Documents'}
          </h3>
          
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            {isDragReject 
              ? 'Please upload valid PDF files only'
              : 'Drag and drop your PDF files here, or click to browse'
            Drag and drop PDF files here, or click to browse
          </p>
          
          <Button variant="outline" size="sm">
            Choose Files
          </Button>
        </div>
        
        <div className="text-xs text-slate-500 dark:text-slate-400">
          PDF format only • Multiple files supported • No size limit
        </div>
      </div>
    </div>
  )
}

// Individual file item component
function FileItem({ 
  file, 
  index, 
  isSelected, 
  onToggleSelect, 
  onRemove, 
  onEdit 
}: {
  file: PDFFile
  index: number
  isSelected: boolean
  onToggleSelect: () => void
  onRemove: () => void
  onEdit: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-all',
        isSelected && 'ring-2 ring-primary-500 border-primary-500',
        isDragging && 'shadow-lg scale-105'
      )}
    >
      {/* Drag Handle */}
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <div className="w-2 h-6 flex flex-col justify-center gap-1">
          <div className="w-full h-0.5 bg-slate-400 rounded"></div>
          <div className="w-full h-0.5 bg-slate-400 rounded"></div>
          <div className="w-full h-0.5 bg-slate-400 rounded"></div>
        </div>
      </div>

      {/* Selection Checkbox */}
      <button onClick={onToggleSelect} className="flex-shrink-0">
        {isSelected ? (
          <CheckSquare className="h-5 w-5 text-primary-600" />
        ) : (
          <Square className="h-5 w-5 text-slate-400 hover:text-slate-600" />
        )}
      </button>

      {/* File Icon */}
      <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate" title={file.name}>{file.name}</h4>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {(file.size / 1024 / 1024).toFixed(1)} MB
          {file.pageCount > 0 && ` • ${file.pageCount} pages`}
        </p>
        
        {/* Upload Progress */}
        {file.status === 'uploading' && (
          <div className="mt-2">
            <Progress value={file.uploadProgress} className="h-1" />
          </div>
        )}
        
        {/* Error Display */}
        {file.status === 'error' && (
          <div className="flex items-center gap-1 mt-1 text-red-600 dark:text-red-400">
            <AlertCircle className="h-3 w-3" />
            <span className="text-xs">{file.error}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1">
        {file.status === 'ready' && (
          <Button variant="ghost" size="sm" onClick={onEdit}>
            Edit
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={onRemove}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}