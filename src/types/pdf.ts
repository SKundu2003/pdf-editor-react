export type AnnotationMode = 'select' | 'text' | 'image'

export type TextStyle = {
  fontSize: number
  color: string // hex like #000000
}

export type TextAnnotation = {
  pageIndex: number
  text: string
  x: number // PDF points from left
  y: number // PDF points from bottom
  style: TextStyle
}
