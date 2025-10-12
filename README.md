# PDF Editor with Text Editing (React + Vite + PDFTron WebViewer)

A modern PDF editor that allows direct text editing within PDF documents using PDFTron WebViewer technology.

## Features

- **Direct Text Editing**: Double-click on any text in the PDF to edit it directly
- **Real-time Text Modification**: Edit text content with live preview
- **Text Formatting**: Change text size and color using the toolbar
- **Mode Switching**: Toggle between select mode and text editing mode
- **Export**: Export edited PDFs with all changes preserved
- **Responsive UI**: Clean, modern interface built with Tailwind CSS

## Tech Stack

- React 18.2.0, Vite, TypeScript
- Tailwind CSS for styling
- PDFTron WebViewer for PDF rendering and text editing
- pdf-lib for PDF manipulation and export

## Getting Started

1. Install dependencies
   ```bash
   npm install
   ```

2. Set up environment variables (optional):
   - Copy `.env.example` to `.env`
   - Add your PDFTron license key to `VITE_PDFTRON_LICENSE_KEY`
   - If no license key is provided, it will run in demo mode with watermarks

3. Run the dev server
   ```bash
   npm run dev
   ```

4. Open the app (the terminal will show the local URL, e.g., http://localhost:5173)

## Text Editing Instructions

1. Click "Open PDF" to load a PDF document
2. Click the "Text" button in the toolbar to enter text editing mode
3. **Double-click** on any text in the PDF to start editing
4. Use **Backspace/Delete** to remove characters
5. Use **Enter** to create new lines
6. Use toolbar to change **size** and **color**
7. Press **Escape** to exit text editing mode

## Troubleshooting

If text editing isn't working:
1. Make sure you're in "Text" mode (blue button in toolbar)
2. Try double-clicking on text - you should see a cursor appear
3. Check the browser console for any error messages
4. Ensure the PDF document is properly loaded
5. Verify that PDFTron WebViewer is properly initialized

## License

This project uses PDFTron WebViewer. You'll need a commercial license for production use without watermarks.
