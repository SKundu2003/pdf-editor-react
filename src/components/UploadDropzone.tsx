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
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-blue-600">Drop the PDF files here...</p>
      ) : (
        <div>
          <p className="text-gray-600">Drag and drop PDF files here, or click to select files</p>
          <p className="text-sm text-gray-500 mt-2">Only PDF files are accepted</p>
        </div>
      )}
    </div>
  )
}

export default UploadDropzone
