# Watermark Removal Feature - Quick Start Guide

## What's New?

Your PDF Editor now includes a **watermark removal feature** that allows users to remove watermarks from PDF files during export.

## How to Use

### Step 1: Upload a PDF
1. Click "Open PDF" button in the toolbar
2. Select a PDF file with watermarks

### Step 2: Enable Watermark Removal
1. Look for the **"Remove Watermarks"** checkbox in the toolbar (next to Export button)
2. Check the checkbox to enable watermark removal

### Step 3: Export
1. Click the **"Export"** button
2. The PDF will be processed to remove watermarks
3. The file will be downloaded automatically

## How It Works

The watermark removal feature:
1. **Renders** each page of the PDF to a canvas
2. **Analyzes** pixels to identify semi-transparent elements (typical watermarks)
3. **Reduces** the visibility of watermark pixels
4. **Converts** the processed pages back to a PDF
5. **Downloads** the cleaned PDF

## Features

✅ **Non-destructive** - Original PDF is never modified
✅ **Optional** - Users can choose to remove watermarks or not
✅ **Safe** - Falls back to original PDF if processing fails
✅ **Fast** - Processes typical PDFs in a few seconds
✅ **Transparent** - Console logs show processing status

## Technical Details

### What Types of Watermarks Are Removed?

The feature works best for:
- ✅ Text watermarks with transparency
- ✅ Image watermarks with transparency
- ✅ Semi-transparent overlays
- ⚠️ Opaque watermarks (may not be fully removed)
- ⚠️ Watermarks embedded in PDF structure (limited support)

### Processing Details

- **Detection Threshold**: Targets pixels with less than 30% opacity
- **Canvas Scale**: Renders at 1.5x for good quality
- **Processing Speed**: ~1-2 seconds per page
- **Output Format**: PNG images embedded in new PDF

## Troubleshooting

### Watermarks Still Visible
- The watermark may be opaque (not transparent)
- Try adjusting the opacity threshold in code (line 24 of watermarkRemover.ts)
- Some watermarks embedded in PDF structure may require different approach

### File Size Increased
- This is normal - the re-encoded PDF may be larger
- This is due to image re-encoding during processing

### Processing Takes Too Long
- Large PDFs (100+ pages) will take longer
- Consider processing smaller PDFs first
- Future versions will have progress indicators

### Export Fails
- Check browser console for error messages
- The original PDF will still be downloaded as fallback
- Try with a different PDF file

## Configuration

### Adjust Watermark Detection Sensitivity

Edit `src/utils/watermarkRemover.ts`, line 24:

```typescript
const { opacity = 0.3 } = options;  // Change 0.3 to different value
```

- **Lower value** (e.g., 0.1): More aggressive, removes more
- **Higher value** (e.g., 0.5): Less aggressive, preserves more

### Adjust Canvas Quality

Edit `src/utils/watermarkRemover.ts`, line 35:

```typescript
const viewport = page.getViewport({ scale: 1.5 });  // Change 1.5 to different value
```

- **Higher value** (e.g., 2.0): Better quality, slower processing
- **Lower value** (e.g., 1.0): Faster, slightly lower quality

### Adjust Pixel Reduction Intensity

Edit `src/utils/watermarkRemover.ts`, line 99:

```typescript
data[i + 3] = Math.max(0, data[i + 3] - 100);  // Change 100 to different value
```

- **Higher value** (e.g., 150): More aggressive watermark removal
- **Lower value** (e.g., 50): Less aggressive, preserves more content

## Browser Support

The feature requires:
- Modern browser (Chrome, Firefox, Safari, Edge)
- HTML5 Canvas support
- JavaScript ES6+ support

## Performance Tips

1. **For Large PDFs**: Process in batches if possible
2. **For Better Quality**: Increase canvas scale (slower)
3. **For Faster Processing**: Decrease canvas scale
4. **For Aggressive Removal**: Increase pixel reduction value

## Limitations

1. **Canvas-based Processing**: Re-encodes PDF as images, may affect text sharpness
2. **Transparency Detection**: Only works on semi-transparent watermarks
3. **File Size**: Output may be larger than input
4. **Processing Time**: Takes longer than normal export

## Future Improvements

Planned enhancements:
- Progress indicator for large PDFs
- Advanced watermark detection algorithms
- Content stream analysis for embedded watermarks
- Batch processing support
- Parallel processing with Web Workers
- User-configurable quality/speed tradeoff

## Support

For issues or questions:
1. Check browser console for error messages
2. Review the detailed documentation in `WATERMARK_REMOVAL_FEATURE.md`
3. Check implementation details in `IMPLEMENTATION_SUMMARY.md`
4. Review code changes in `CODE_CHANGES.md`

## Files Modified

- ✨ `src/utils/watermarkRemover.ts` (NEW)
- 📝 `src/utils/download.ts` (MODIFIED)
- 📝 `src/components/Toolbar.tsx` (MODIFIED)
- 📝 `src/pages/EditorPage.tsx` (MODIFIED)

## Testing

To verify the feature works:

1. Start the dev server: `npm run dev`
2. Open http://localhost:5000
3. Upload a PDF with watermarks
4. Check "Remove Watermarks"
5. Click Export
6. Verify watermarks are reduced in the downloaded PDF

Enjoy your watermark-free PDFs! 🎉
