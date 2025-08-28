export type AnnotationMode = 'select' | 'text' | 'image'

export type TextStyle = {
  fontSize: number
  color: string // hex like #000000
}

export type TextFormat = 'bold' | 'italic' | 'underline'

export type TextAnnotation = {
  id?: string
  x?: number 
  y?: number 
  text?: string
  style?: TextStyle
  formats?: TextFormat[]
  pageNumber?: number
  type?: 'text' | 'image' | 'signature'
}
