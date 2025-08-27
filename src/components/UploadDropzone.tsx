import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {
  onFilesSelected?: (files: File[]) => void
  accept?: string
  multiple?: boolean
  redirectToEditor?: boolean
}

export default function UploadDropzone({ onFilesSelected, accept = 'application/pdf', multiple = true, redirectToEditor }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const handleFiles = useCallback((files: FileList | null) => {
    setError(null)
    if (!files || files.length === 0) return
    const valid: File[] = []
    for (const file of Array.from(files)) {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        valid.push(file)
      }
    }
    if (valid.length === 0) {
      setError('Please upload PDF files (.pdf)')
      return
    }
    onFilesSelected?.(valid)
    if (redirectToEditor) navigate('/editor', { state: { files: valid } })
  }, [onFilesSelected, navigate, redirectToEditor])

  return (
    <div>
      <div
        onDragOver={(e)=>{ e.preventDefault(); setIsDragging(true) }}
        onDragLeave={()=> setIsDragging(false)}
        onDrop={(e)=>{ e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files) }}
        className={
          'relative rounded-xl border-2 border-dashed p-8 text-center transition ' +
          (isDragging ? 'border-primary-500 bg-primary-50/60 dark:bg-slate-800' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800')
        }
        role="button"
        aria-label="Upload PDF files"
      >
        <div className="space-y-2">
          <p className="text-lg font-semibold">Drag & drop PDFs here</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">or</p>
          <button
            onClick={() => inputRef.current?.click()}
            className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700"
          >
            Browse files
          </button>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            hidden
            onChange={(e)=> handleFiles(e.target.files)}
          />
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-600" role="alert">{error}</p>}
    </div>
  )
}
