# PDF Converter & Editor (React 19 + Vite + Tailwind)

A beautifully designed, fully client-side PDF tool to upload, view, annotate, rearrange, merge, and export PDFs — all in the browser. Built with React 19, Tailwind CSS, react-pdf, and pdf-lib.

## Features
- Modern, polished landing page with smooth animations (Framer Motion)
- Drag-and-drop and manual PDF uploads (multi-file)
- Fast PDF viewing with zoom and page navigation (react-pdf)
- Page thumbnails + drag-and-drop page reordering (@hello-pangea/dnd)
- Text annotations (color + font size)
- Merge PDFs on upload (select multiple)
- Export/Download edited PDF (pdf-lib)
- Responsive, accessible UI with Tailwind CSS

## Tech Stack
- React 19, Vite, TypeScript
- Tailwind CSS
- react-pdf (pdf.js) for rendering
- pdf-lib for editing/merging/annotations
- @hello-pangea/dnd for page reordering
- framer-motion for landing animations

## Getting Started
1. Install dependencies
   ```bash
   npm install
   ```
2. Run the dev server
   ```bash
   npm run dev
   ```
3. Open the app (the terminal will show the local URL, e.g., http://localhost:5173)

## Project Structure
```
src/
  components/
    Footer.tsx
    Header.tsx
    PageThumbnails.tsx       # Thumbnails + drag-and-drop reorder
    PdfViewer.tsx            # Main page viewer with annotation click handler
    Toolbar.tsx              # Controls (open, zoom, modes, export)
    UploadDropzone.tsx       # Drag & drop + file picker
  hooks/
    usePdfState.ts           # Central PDF state + operations
  pages/
    LandingPage.tsx          # Beautiful hero, features, CTA, upload
    EditorPage.tsx           # Main workspace wiring viewer + thumbnails + toolbar
  services/
    pdfService.ts            # pdf-lib utilities: merge, reorder, add annotations
  types/
    pdf.ts                   # Annotation and style types
  utils/
    download.ts              # Download helper
  setupPdfWorker.ts          # pdf.js worker config for react-pdf
  App.tsx
  index.css
  main.tsx
```

## Key Components & Responsibilities
- Header/Footer: Navigation and footer text.
- LandingPage: Animated hero, feature highlights, and embedded upload dropzone.
- UploadDropzone: Accessible drag-and-drop and file picker with validation and helpful messages.
- Toolbar: Zoom controls, mode selection (select/text), text styling controls, page navigation, and export.
- PdfViewer: Renders current page; captures click coordinates to add text annotations; previews annotations.
- PageThumbnails: Displays ordered pages; users drag to reorder; updates `pageOrder` state.
- usePdfState: Loads PDFs, merges multi-upload, tracks pages/zoom/order, applies annotations, exports final bytes using pdf-lib.
- pdfService: All pdf-lib actions (merge, reorder, draw text, draw images if extended).

## User Flow
1. Land on the landing page `LandingPage.tsx`.
2. Click "Get Started" or upload directly via the dropzone.
3. In the editor, use the sidebar thumbnails to navigate and reorder pages.
4. Use the Toolbar to switch to Text mode, click on the page to place a text annotation, adjust size/color.
5. Export to download the edited PDF.

## Example: Adding a Text Annotation
The viewer sends page coordinates back to the editor when clicked in text mode:
```ts
// EditorPage.tsx (excerpt)
const handleViewerClick = ({ pageIndex, xPoints, yPoints }) => {
  if (mode !== 'text') return
  const text = window.prompt('Enter text to add:')
  if (!text) return
  addText({
    pageIndex,
    text,
    x: xPoints,
    y: yPoints,
    style: { color: textColor, fontSize: textSize },
  })
}
```
These annotations are saved during export using `pdf-lib` in `usePdfState.exportEdited()`.

## Accessibility & Responsiveness
- All interactive elements have clear focus styles and ARIA labels where applicable.
- Layout adapts across mobile, tablet, and desktop; the editor uses a responsive grid.

## Error Handling
- Upload validation in `UploadDropzone.tsx` (accept only PDFs) with helpful error messages.
- Export wrapped in try/catch with user feedback.
- Defensive checks when loading documents and when bytes are not ready.

## Extending the App
- Image annotations: `pdfService.addImageAnnotations()` already supports PNG/JPEG; add a UI tool to select an image and place it similar to text.
- Form fill support: pdf-lib supports basic form operations; detect and update fields before saving.
- Conversion (PDF -> images or vice versa): integrate client-side render-to-image, or handle via WebAssembly libraries.

## Notes
- All PDF processing happens locally in the browser. Large PDFs may be memory-intensive; consider chunked rendering if needed.
- The `setupPdfWorker.ts` wires the pdf.js worker required by `react-pdf`.
