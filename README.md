# PDF Converter & Editor (React 19 + Vite + Tailwind)

A beautifully designed, fully client-side PDF tool to upload, view, annotate, rearrange, merge, and export PDFs — all in the browser. Built with React 19, Tailwind CSS, react-pdf, and pdf-lib.

## Features
- **PDF to DOCX Conversion**: Convert PDF files to editable DOCX format
- **Native DOCX Editor**: Full-featured Word-like editing experience
- **Format Preservation**: Maintains original formatting, styles, images, and tables
- **Export Capabilities**: Export to both DOCX and PDF formats
- **Drag-and-Drop Upload**: Easy file upload with validation
- **Real-time Editing**: Professional editing tools and formatting options
- **Responsive Design**: Works seamlessly across all devices

## Tech Stack
- React 19, Vite, TypeScript  
- Tailwind CSS
- Syncfusion Document Editor for native DOCX editing
- Mammoth.js for DOCX content extraction (fallback)
- docx.js for document generation (fallback)
- Zustand for state management

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

## Syncfusion License
This project uses Syncfusion components which require a license for commercial use. 
You can get a free community license at: https://www.syncfusion.com/products/communitylicense

Add your license key to `src/components/DocxEditor/NativeDocxEditor.tsx`:
```typescript
registerLicense('YOUR_SYNCFUSION_LICENSE_KEY_HERE')
```

## Project Structure
```
src/
  components/
    DocxEditor/
      DocxUploader.tsx       # PDF upload and conversion interface
      NativeDocxEditor.tsx   # Syncfusion-based DOCX editor
      DocxTextEditor.tsx     # Editor component wrapper
      DocxWorkflow.tsx       # Main workflow orchestration
    UI/
      Button.tsx             # Reusable button component
      Toast.tsx              # Toast notification system
      Progress.tsx           # Progress indicator
  services/
    docxService.ts           # DOCX conversion and processing
  types/
    docx.ts                  # DOCX-related type definitions
  App.tsx
  index.css
  main.tsx
```

## Key Components & Responsibilities
- **DocxUploader**: Handles PDF file upload and conversion to DOCX
- **NativeDocxEditor**: Syncfusion-based native DOCX editor with full Word-like functionality
- **DocxWorkflow**: Orchestrates the complete document processing workflow
- **docxService**: Manages API communication and document processing
- **Toast System**: Provides user feedback for all operations

## User Flow
1. **Upload**: Drag and drop or select PDF files for conversion
2. **Convert**: Backend API converts PDF to DOCX format
3. **Edit**: Native DOCX editor opens with full formatting preserved
4. **Export**: Save edited document as DOCX or PDF

## Accessibility & Responsiveness
- All interactive elements have proper ARIA labels and keyboard navigation
- Responsive design works across mobile, tablet, and desktop
- High contrast support and screen reader compatibility

## Error Handling
- Comprehensive file validation (type, size, format)
- Network error handling with retry mechanisms  
- Graceful fallbacks for editor loading failures
- Clear user feedback for all error states

## Extending the App
- **Additional Formats**: Extend to support other document formats (RTF, ODT)
- **Cloud Storage**: Integrate with cloud storage providers
- **Collaboration**: Add real-time collaborative editing features
- **Templates**: Provide document templates for common use cases

## Notes
- DOCX editing happens entirely in the browser using Syncfusion components
- Large documents are handled efficiently with virtual scrolling
- All document processing preserves original formatting and structure
- Backend API handles PDF-to-DOCX conversion for optimal quality
