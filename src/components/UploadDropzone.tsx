import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface Props {
  onFilesSelected: (files: File[]) => void
}

const UploadDropzone = ({ onFilesSelected }: Props) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFilesSelected(acceptedFiles)
    }
  }, [onFilesSelected])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: true,
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-300 dark:border-slate-700 hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/10'
        }`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-primary-600 dark:text-primary-400 font-medium">Drop the PDF files here...</p>
      ) : (
        <div>
          <p className="text-slate-600 dark:text-slate-300 font-medium">Drag and drop PDF files here, or click to select files</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Only PDF files are accepted</p>
        </div>
      )}
    </div>
  )
}

export default UploadDropzone
