import React from 'react'
import { FileText, Calendar, User, Hash, Layers } from 'lucide-react'
import { useEditorStore } from '../../store/editorStore'
import { formatFileSize, formatDate } from '../../utils/format'

export default function DocumentInfo() {
  const { currentPdf, uploadedFiles, mergedPdf, hasUnsavedChanges, pageOrder } = useEditorStore()

  if (!currentPdf && uploadedFiles.length === 0) {
    return (
      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
          No documents uploaded
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Current Document Info */}
      {currentPdf && (
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Current Document
          </h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Name:</span>
              <span className="font-medium truncate ml-2" title={currentPdf.name}>
                {currentPdf.name}
              </span>
            </div>
            
            {'file' in currentPdf && (
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Size:</span>
                <span className="font-medium">{formatFileSize(currentPdf.size)}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Pages:</span>
              <span className="font-medium">{currentPdf.pageCount}</span>
            </div>
            
            {'status' in currentPdf && (
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Status:</span>
                <span className={`font-medium ${
                  currentPdf.status === 'ready' ? 'text-green-600 dark:text-green-400' :
                  currentPdf.status === 'error' ? 'text-red-600 dark:text-red-400' :
                  'text-amber-600 dark:text-amber-400'
                }`}>
                  {currentPdf.status === 'ready' ? 'Ready' :
                   currentPdf.status === 'error' ? 'Error' :
                   currentPdf.status === 'processing' ? 'Processing' : 'Uploading'}
                </span>
              </div>
            )}

            {hasUnsavedChanges && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                  <span className="text-xs">Unsaved changes</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Summary */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Layers className="h-4 w-4" />
          Upload Summary
        </h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-400">Total Files:</span>
            <span className="font-medium">{uploadedFiles.length}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-400">Total Size:</span>
            <span className="font-medium">
              {formatFileSize(uploadedFiles.reduce((sum, f) => sum + f.size, 0))}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-400">Total Pages:</span>
            <span className="font-medium">
              {pageOrder?.totalPages || uploadedFiles.reduce((sum, f) => sum + f.pageCount, 0)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-400">Ready Files:</span>
            <span className="font-medium text-green-600 dark:text-green-400">
              {uploadedFiles.filter(f => f.status === 'ready').length}
            </span>
          </div>
        </div>
      </div>

      {/* Merged PDF Info */}
      {mergedPdf && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-900 dark:text-green-100">
            <Layers className="h-4 w-4" />
            Merged Document
          </h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-green-700 dark:text-green-300">Files Merged:</span>
              <span className="font-medium">{mergedPdf.files.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700 dark:text-green-300">Total Pages:</span>
              <span className="font-medium">{mergedPdf.pageCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700 dark:text-green-300">Status:</span>
              <span className={`font-medium ${
                mergedPdf.status === 'ready' ? 'text-green-600 dark:text-green-400' :
                mergedPdf.status === 'error' ? 'text-red-600 dark:text-red-400' :
                'text-amber-600 dark:text-amber-400'
              }`}>
                {mergedPdf.status === 'ready' ? 'Ready' :
                 mergedPdf.status === 'error' ? 'Error' :
                 'Merging...'}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Quick Tips</h4>
        <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Upload multiple PDFs and merge them</li>
          <li>• Drag pages to reorder across all PDFs</li>
          <li>• Use Ctrl+S to save changes</li>
          <li>• Use Ctrl+Z/Y for undo/redo</li>
          <li>• Export when finished to download</li>
        </ul>
      </div>
    </div>
  )
}