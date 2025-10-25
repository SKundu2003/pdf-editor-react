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
- 2025-10-25: Complete UI/UX redesign for professional appearance
  - Redesigned header with larger logo (h-16), gradient text for branding, colorful badge pills
  - Completely rebuilt landing page with modern sections:
    * Hero section with large gradient headline "Edit PDFs Like Magic"
    * Stats showcase (100% Free, No Registration, ∞ Unlimited)
    * Single CTA: "Upload & Edit PDF Now" - direct path to editing
    * Prominent "Free Forever • Powered by Ads" messaging
    * Feature cards highlighting advanced capabilities not found elsewhere
    * "Advanced Features Not Found Elsewhere" section emphasizing unique capabilities
    * Character-level text editing feature prominently highlighted
    * Clear explanation of ad-supported free model
    * Step-by-step guide cards
    * CTA section with gradient background
  - Removed "No Watermarks" claim (PDFTron adds watermarks)
  - Removed "View All Tools" button (most features coming soon)
  - Added emphasis on unique advanced features
  - Added Heroicons for professional iconography
  - Improved animations with Framer Motion (fade-in, hover effects)
  - Better spacing, typography, and visual hierarchy throughout
  - Modern gradients, shadows, and rounded corners for premium look
  
- 2025-10-25: Branding update to Bright Linx Allied Ventures
  - Updated all branding from "BRIGHT LINK" to "BRIGHT LINX"
  - Integrated official Bright Linx logo image in header
  - Updated company name to "Bright Linx Allied Ventures"
  - Updated all SEO meta tags and structured data with correct branding
  
- 2025-10-25: SEO optimization and Coming Soon page
  - Implemented comprehensive SEO with meta tags, Open Graph, Twitter cards
  - Added Schema.org structured data for better search engine understanding
  - Added SEO-optimized keywords: PDF editor, PDF converter, edit PDF online, merge PDF, compress PDF, etc.
  - Created Coming Soon page showcasing 12 upcoming features (PDF to Word, PDF to Excel, signatures, etc.)
  - Added SEO content section on landing page with keywords and user benefits
  - Updated page titles and meta descriptions dynamically
  - Fixed Export button to download edited PDF with PDFTron changes
  
- 2025-10-25: Header improvements and navigation cleanup
  - Added beautiful gradient background to header (yellow → green → blue) matching Live Preview style
  - Removed "Docs" links from navigation (not implemented)
  - Enhanced "ALL Tools" menu styling with better visual hierarchy
  - Verified Export functionality works correctly (downloads edited PDF)
  
- 2025-10-24: Complete UI redesign per client specifications
  - Updated branding to "BRIGHT LINX" with custom logo
  - Changed color scheme from blue to light green theme
  - Added "Ivory Free" and "NO Limits" feature badges
  - Implemented "ALL Tools" navigation menu in header
  - Added language selector with globe icon
  - Updated Live Preview section with light yellow background
  - Created comprehensive footer with links: About Us, FAQ, Help, Contact, Legal, Terms of Use, Privacy Policy, Privacy Settings
  - Added "It's Completely free, Powered by Ads" message to footer
  - Updated all buttons to use light green color scheme
  
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
