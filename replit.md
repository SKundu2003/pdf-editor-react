# PDF Converter & Editor

## Overview
A modern PDF editor built with React, Vite, and PDFTron WebViewer that allows direct text editing within PDF documents. This application provides real-time text modification, formatting controls, and export capabilities.

## Tech Stack
- **Frontend Framework**: React 19.0.0 with TypeScript
- **Build Tool**: Vite 5.4.0
- **Styling**: Tailwind CSS
- **PDF Engine**: PDFTron WebViewer 10.12.1
- **PDF Manipulation**: pdf-lib, pdfjs-dist
- **UI Components**: Framer Motion, React Dropzone, @dnd-kit
- **Routing**: React Router DOM

## Project Structure
```
├── src/
│   ├── components/        # React components
│   │   ├── PdfViewer.tsx  # Main PDF viewer component
│   │   ├── TextEditor.tsx # Text editing functionality
│   │   ├── Toolbar.tsx    # Editor toolbar
│   │   └── ...
│   ├── pages/             # Page components
│   │   ├── LandingPage.tsx
│   │   └── EditorPage.tsx
│   ├── services/          # Business logic
│   │   ├── pdfService.ts
│   │   └── pdfTronService.ts
│   ├── context/           # React context
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
├── public/
│   └── lib/webviewer/     # PDFTron WebViewer library files
└── vite.config.ts         # Vite configuration
```

## Development Setup

### Configuration
- **Port**: 5000 (Replit requirement)
- **Host**: 0.0.0.0 (accepts all connections for Replit proxy)
- **Build System**: Vite with React plugin
- **TypeScript**: Configured with strict mode

### Running Locally
The development server runs automatically via the configured workflow:
- Command: `npm run dev`
- Port: 5000
- Hot Module Reload: Enabled

### Building for Production
```bash
npm run build
```

## Features
- **Direct Text Editing**: Double-click on any text in PDFs to edit like notepad
- **Real-time Preview**: See text modifications instantly
- **Text Formatting**: Change text size and color
- **Page Rearrangement**: Drag-and-drop page thumbnails to reorder pages
- **Thumbnails Sidebar**: Collapsible sidebar with page previews and navigation
- **Mode Switching**: Toggle between select and text editing modes
- **PDF Export**: Export edited PDFs with all changes preserved
- **Drag-and-Drop Upload**: Easy file upload interface
- **Responsive Design**: Clean, modern interface

## Environment Notes
- Configured for Replit deployment
- PDFTron WebViewer runs in demo mode (watermarks) without license key
- Optional: Set `VITE_PDFTRON_LICENSE_KEY` environment variable for production use

## Recent Changes
- 2025-10-22: Added page rearrangement feature
  - Implemented collapsible thumbnails sidebar with drag-and-drop page reordering
  - Added toggle button to show/hide page thumbnails
  - Integrated @dnd-kit for smooth drag-and-drop experience
  - Pages can be clicked to navigate, dragged to reorder
  - Removed instructions overlay and footer for cleaner UI
  
- 2025-10-22: Enhanced text editing functionality
  - Enabled PDFTron ContentEdit Manager for direct text editing
  - Added double-click to start editing text at cursor position
  - Users can now backspace to delete characters and type new text (like notepad)
  - Set up text color and size properties for content editing
  - Fixed text mode to allow character-level editing instead of just annotations
  
- 2025-10-22: Initial Replit setup
  - Configured Vite server for port 5000 with host 0.0.0.0
  - Installed all npm dependencies
  - Set up development workflow
  - Verified server runs successfully
