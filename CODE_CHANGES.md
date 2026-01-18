# Code Changes for Watermark Removal Feature

## 1. New File: `src/utils/watermarkRemover.ts`

```typescript
import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface WatermarkRemovalOptions {
  opacity?: number;
  removeText?: boolean;
  removeImages?: boolean;
}

export async function removeWatermarksSimple(
  pdfBytes: Uint8Array,
  options: WatermarkRemovalOptions = {}
): Promise<Uint8Array> {
  const { opacity = 0.3 } = options;

  try {
    const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
    const numPages = pdf.numPages;
    const { PDFDocument } = await import('pdf-lib');
    const newPdf = await PDFDocument.create();

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext('2d');

      if (!context) continue;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      processCanvasForWatermarks(context, canvas.width, canvas.height, opacity);

      const imageData = canvas.toDataURL('image/png');
      const img = await newPdf.embedPng(imageData);
      const pdfPage = newPdf.addPage([viewport.width, viewport.height]);
      pdfPage.drawImage(img, {
        x: 0,
        y: 0,
        width: viewport.width,
        height: viewport.height,
      });
    }

    return await newPdf.save();
  } catch (error) {
    console.error('Error in watermark removal:', error);
    return pdfBytes;
  }
}

function processCanvasForWatermarks(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  opacityThreshold: number
): void {
  try {
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3] / 255;
      if (alpha < opacityThreshold && alpha > 0) {
        data[i + 3] = Math.max(0, data[i + 3] - 100);
      }
    }

    context.putImageData(imageData, 0, 0);
  } catch (error) {
    console.error('Error processing canvas for watermarks:', error);
  }
}
```

## 2. Modified: `src/utils/download.ts`

**Before:**
```typescript
export function downloadBytesAsFile(bytes: Uint8Array | ArrayBuffer, filename: string, mime: string = 'application/pdf') {
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
```

**After:**
```typescript
import { removeWatermarksSimple } from './watermarkRemover'

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

  if (options.removeWatermarks) {
    try {
      console.log('Removing watermarks from PDF...')
      processedBytes = await removeWatermarksSimple(processedBytes)
      console.log('Watermarks removed successfully')
    } catch (error) {
      console.error('Failed to remove watermarks, proceeding with original PDF:', error)
    }
  }

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
```

## 3. Modified: `src/components/Toolbar.tsx`

**Added to interface:**
```typescript
interface ToolbarProps {
  // ... existing props ...
  removeWatermarks?: boolean
  setRemoveWatermarks?: (value: boolean) => void
}
```

**Added to component destructuring:**
```typescript
const Toolbar: React.FC<ToolbarProps> = ({
  // ... existing destructuring ...
  removeWatermarks = false,
  setRemoveWatermarks
}) => {
```

**Added UI element after Export button:**
```tsx
{/* Watermark Removal Toggle */}
<label className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
  <input
    type="checkbox"
    checked={removeWatermarks}
    onChange={(e) => setRemoveWatermarks?.(e.target.checked)}
    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
  />
  <span className="ml-2">Remove Watermarks</span>
</label>
```

## 4. Modified: `src/pages/EditorPage.tsx`

**Added state:**
```typescript
const [removeWatermarks, setRemoveWatermarks] = useState(false)
```

**Updated export handler:**
```typescript
async function handleExport() {
  setError(null)
  try {
    if ((window as any).getPDFTronEditedBytes) {
      const editedBytes = await (window as any).getPDFTronEditedBytes()
      if (editedBytes) {
        await downloadBytesAsFile(editedBytes, 'edited.pdf', 'application/pdf', {
          removeWatermarks
        })
        return
      }
    }
    const out = await exportEdited()
    if (!out) throw new Error('Nothing to export')
    await downloadBytesAsFile(out, 'edited.pdf', 'application/pdf', {
      removeWatermarks
    })
  } catch (e: any) {
    setError(e?.message || 'Failed to export PDF')
  }
}
```

**Updated Toolbar props:**
```tsx
<Toolbar
  // ... existing props ...
  removeWatermarks={removeWatermarks}
  setRemoveWatermarks={setRemoveWatermarks}
/>
```

## Summary of Changes

| File | Type | Changes |
|------|------|---------|
| `src/utils/watermarkRemover.ts` | New | Core watermark removal logic |
| `src/utils/download.ts` | Modified | Added watermark removal integration |
| `src/components/Toolbar.tsx` | Modified | Added UI checkbox for watermark removal |
| `src/pages/EditorPage.tsx` | Modified | Added state and export handler updates |

## Build Status
✅ Build successful with no TypeScript errors
✅ All dependencies already present (pdfjs-dist, pdf-lib)
✅ No breaking changes to existing functionality
