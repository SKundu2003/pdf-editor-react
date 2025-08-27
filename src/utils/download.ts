export function downloadBytesAsFile(bytes: Uint8Array | ArrayBuffer, filename: string, mime: string = 'application/pdf') {
  // Ensure we hand Blob an ArrayBuffer, not ArrayBufferLike/typed array, to satisfy DOM typings.
  const buffer: ArrayBuffer = bytes instanceof Uint8Array
    ? (bytes.byteOffset === 0 && bytes.byteLength === bytes.buffer.byteLength
        ? (bytes.buffer as ArrayBuffer)
        : (bytes.buffer as ArrayBuffer).slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength))
    : (bytes as ArrayBuffer)

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
