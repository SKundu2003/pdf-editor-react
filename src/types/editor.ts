export interface PDFFile {
  id: string
  file: File
  name: string
  size: number
  pageCount: number
  uploadProgress: number
  status: 'uploading' | 'processing' | 'ready' | 'error'
  error?: string
}

export interface ConvertedContent {
  html: string
  originalStructure: any
  fonts: string[]
  styles: string[]
}

export interface EditorState {
  currentPdf: PDFFile | null
  convertedContent: ConvertedContent | null
  isEditing: boolean
  hasUnsavedChanges: boolean
  editedContent: string
  apiStatus: 'idle' | 'converting' | 'generating' | 'error'
  apiError: string | null
}

export interface APIProgress {
  stage: 'uploading' | 'converting' | 'processing' | 'downloading'
  progress: number
  message: string
}

export interface TextFormat {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  fontSize?: number
  fontFamily?: string
  color?: string
  alignment?: 'left' | 'center' | 'right' | 'justify'
}

export interface DocumentMetadata {
  title?: string
  author?: string
  subject?: string
  keywords?: string
  creator?: string
  producer?: string
  creationDate?: Date
  modificationDate?: Date
}