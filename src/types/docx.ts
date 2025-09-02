export interface DocxFile {
  id: string
  name: string
  size: number
  blob: Blob
  status: 'uploading' | 'converting' | 'ready' | 'error'
  error?: string
  uploadProgress: number
  conversionProgress: number
}

export interface DocxConversionProgress {
  stage: 'uploading' | 'converting' | 'processing' | 'complete'
  progress: number
  message: string
}

export interface DocxEditorState {
  currentDocx: DocxFile | null
  isEditing: boolean
  hasUnsavedChanges: boolean
  editorContent: any
  originalContent: any
}

export interface DocxApiResponse {
  success: boolean
  data?: Blob
  error?: string
  message?: string
}