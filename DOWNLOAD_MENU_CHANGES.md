# Download Menu Implementation - Code Changes

## Summary of Changes

This document shows all the code changes made to implement the Download Menu with watermark removal.

## 1. New File: `src/components/DownloadMenu.tsx`

```typescript
import React, { useState, useRef, useEffect } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

interface DownloadMenuProps {
  onDownloadWithWatermark: () => void
  onDownloadWithoutWatermark: () => void
  disabled?: boolean
}

const DownloadMenu: React.FC<DownloadMenuProps> = ({
  onDownloadWithWatermark,
  onDownloadWithoutWatermark,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleDownloadWithWatermark = () => {
    onDownloadWithWatermark()
    setIsOpen(false)
  }

  const handleDownloadWithoutWatermark = () => {
    onDownloadWithoutWatermark()
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>Download</span>
        <ChevronDownIcon className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-300 rounded-md shadow-lg z-50">
          <button
            onClick={handleDownloadWithWatermark}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-200 flex items-start"
          >
            <div>
              <div className="font-medium text-gray-900">Download with Watermarks</div>
              <div className="text-xs text-gray-500 mt-1">Keep original watermarks in the PDF</div>
            </div>
          </button>

          <button
            onClick={handleDownloadWithoutWatermark}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-start"
          >
            <div>
              <div className="font-medium text-gray-900">Download without Watermarks</div>
              <div className="text-xs text-gray-500 mt-1">Remove watermarks before downloading</div>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}

export default DownloadMenu
```

## 2. Modified: `src/components/Toolbar.tsx`

### Added Import
```typescript
import DownloadMenu from './DownloadMenu'
```

### Updated Interface
```typescript
// BEFORE
interface ToolbarProps {
  // ... other props ...
  onExport: () => void
  // ... other props ...
}

// AFTER
interface ToolbarProps {
  // ... other props ...
  onDownloadWithWatermark: () => void
  onDownloadWithoutWatermark: () => void
  // ... other props ...
}
```

### Updated Destructuring
```typescript
// BEFORE
const Toolbar: React.FC<ToolbarProps> = ({
  // ... other destructuring ...
  onExport,
  canExport,
  onClearAll,
  removeWatermarks = false,
  setRemoveWatermarks
}) => {

// AFTER
const Toolbar: React.FC<ToolbarProps> = ({
  // ... other destructuring ...
  onDownloadWithWatermark,
  onDownloadWithoutWatermark,
  canExport,
  onClearAll
}) => {
```

### Replaced UI Element
```typescript
// BEFORE
<button
  onClick={onExport}
  disabled={!canExport}
  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
>
  <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
  Export
</button>

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

// AFTER
<DownloadMenu
  onDownloadWithWatermark={onDownloadWithWatermark}
  onDownloadWithoutWatermark={onDownloadWithoutWatermark}
  disabled={!canExport}
/>
```

## 3. Modified: `src/pages/EditorPage.tsx`

### Removed State
```typescript
// REMOVED
const [removeWatermarks, setRemoveWatermarks] = useState(false)
```

### Replaced Export Handler
```typescript
// BEFORE
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

// AFTER - Two separate handlers
async function handleDownloadWithWatermark() {
  setError(null)
  try {
    if ((window as any).getPDFTronEditedBytes) {
      const editedBytes = await (window as any).getPDFTronEditedBytes()
      if (editedBytes) {
        await downloadBytesAsFile(editedBytes, 'edited.pdf', 'application/pdf', {
          removeWatermarks: false
        })
        return
      }
    }
    const out = await exportEdited()
    if (!out) throw new Error('Nothing to export')
    await downloadBytesAsFile(out, 'edited.pdf', 'application/pdf', {
      removeWatermarks: false
    })
  } catch (e: any) {
    setError(e?.message || 'Failed to download PDF')
  }
}

async function handleDownloadWithoutWatermark() {
  setError(null)
  try {
    if ((window as any).getPDFTronEditedBytes) {
      const editedBytes = await (window as any).getPDFTronEditedBytes()
      if (editedBytes) {
        await downloadBytesAsFile(editedBytes, 'edited.pdf', 'application/pdf', {
          removeWatermarks: true
        })
        return
      }
    }
    const out = await exportEdited()
    if (!out) throw new Error('Nothing to export')
    await downloadBytesAsFile(out, 'edited.pdf', 'application/pdf', {
      removeWatermarks: true
    })
  } catch (e: any) {
    setError(e?.message || 'Failed to download PDF')
  }
}
```

### Updated Toolbar Props
```typescript
// BEFORE
<Toolbar
  // ... other props ...
  onExport={handleExport}
  canExport={canExport}
  onClearAll={loadedPdfs.length > 0 ? clearAllPdfs : undefined}
  removeWatermarks={removeWatermarks}
  setRemoveWatermarks={setRemoveWatermarks}
/>

// AFTER
<Toolbar
  // ... other props ...
  onDownloadWithWatermark={handleDownloadWithWatermark}
  onDownloadWithoutWatermark={handleDownloadWithoutWatermark}
  canExport={canExport}
  onClearAll={loadedPdfs.length > 0 ? clearAllPdfs : undefined}
/>
```

## Component Hierarchy

```
EditorPage
├── handleDownloadWithWatermark()
├── handleDownloadWithoutWatermark()
└── Toolbar
    └── DownloadMenu
        ├── Download with Watermarks button
        └── Download without Watermarks button
```

## Data Flow

```
User clicks "Download" button
    ↓
DownloadMenu opens
    ↓
User selects option
    ↓
DownloadMenu calls handler
    ↓
Handler calls downloadBytesAsFile() with removeWatermarks flag
    ↓
If removeWatermarks: true
  → watermarkRemover.removeWatermarksSimple() processes PDF
    ↓
PDF downloaded to machine
```

## Files Changed Summary

| File | Type | Changes |
|------|------|---------|
| `src/components/DownloadMenu.tsx` | NEW | 80 lines - Dropdown menu component |
| `src/components/Toolbar.tsx` | MODIFIED | Replaced Export button with DownloadMenu |
| `src/pages/EditorPage.tsx` | MODIFIED | Two download handlers instead of one |
| `src/utils/watermarkRemover.ts` | EXISTING | No changes (already implemented) |
| `src/utils/download.ts` | EXISTING | No changes (already implemented) |

## Build Results

✅ TypeScript compilation: PASSED
✅ Vite build: PASSED
✅ No errors or warnings
✅ Ready for deployment

## Testing Recommendations

1. Test Download with Watermarks
   - Verify watermarks are present in downloaded PDF

2. Test Download without Watermarks
   - Verify watermarks are removed/reduced in downloaded PDF

3. Test with Different PDFs
   - PDFs with text watermarks
   - PDFs with image watermarks
   - PDFs without watermarks

4. Test Edge Cases
   - Large PDFs (100+ pages)
   - PDFs with opaque watermarks
   - PDFs with embedded watermarks

5. Test UI
   - Menu opens/closes correctly
   - Menu closes when clicking outside
   - Menu disabled when no PDF loaded
   - Descriptions are clear and helpful
