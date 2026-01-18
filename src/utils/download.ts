import { removeWatermarksFromPdf } from './watermarkRemover'

export interface DownloadOptions {
  removeWatermarks?: boolean
  filename?: string
  mime?: string
}

export async function downloadBytesAsFile(
  bytes: Uint8Array | ArrayBuffer,
  filename: string = 'document.pdf',
  mime: string = 'application/pdf',
  options: DownloadOptions = {}
) {
  let processedBytes = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes as ArrayBuffer)

  // Remove watermarks if requested
  if (options.removeWatermarks) {
    try {
      console.log('Removing watermarks from PDF using enhanced background detection...')
      processedBytes = await removeWatermarksFromPdf(processedBytes, {
        method: 'background', // Use advanced background watermark removal
        sensitivity: 0.7,     // High sensitivity for better detection
        opacity: 0.3         // Standard opacity threshold
      })
      console.log('Watermarks removed successfully using enhanced algorithm')
    } catch (error) {
      console.error('Failed to remove watermarks, proceeding with original PDF:', error)
      // Continue with original bytes if watermark removal fails
    }
  }

  // Ensure we hand Blob an ArrayBuffer, not ArrayBufferLike/typed array, to satisfy DOM typings.
  const buffer: ArrayBuffer = processedBytes instanceof Uint8Array
    ? (processedBytes.byteOffset === 0 && processedBytes.byteLength === processedBytes.buffer.byteLength
        ? (processedBytes.buffer as ArrayBuffer)
        : (processedBytes.buffer as ArrayBuffer).slice(processedBytes.byteOffset, processedBytes.byteOffset + processedBytes.byteLength))
    : (processedBytes as ArrayBuffer)

  const blob = new Blob([buffer], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
