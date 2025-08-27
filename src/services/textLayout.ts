import { pdfjs } from 'react-pdf'

export type TextRun = {
  str: string
  x: number
  y: number // PDF points from bottom
  width: number
  height: number
  fontSize: number
  dir: 'ltr' | 'rtl'
}

export async function extractTextRuns(pdfBytes: Uint8Array, pageIndex: number): Promise<TextRun[]> {
  const loadingTask = (pdfjs as any).getDocument({ data: pdfBytes })
  const pdf = await loadingTask.promise
  const page = await pdf.getPage(pageIndex + 1)
  const content = await page.getTextContent()
  const viewport = page.getViewport({ scale: 1 })
  const runs: TextRun[] = []
  for (const item of content.items as any[]) {
    const tx = (pdfjs as any).Util.transform(viewport.transform, item.transform)
    const x = tx[4]
    const yTop = tx[5]
    const height = Math.abs(item.height || item.transform[3] || 0)
    const y = yTop - height // convert top-left to bottom-left
    const width = item.width
    const str: string = item.str
    const dir: 'ltr' | 'rtl' = (item.dir || 'ltr').toLowerCase().startsWith('r') ? 'rtl' : 'ltr'
    const fontSize = item.height || Math.abs(item.transform[3]) || 12
    runs.push({ str, x, y, width, height, fontSize, dir })
  }
  return runs
}
