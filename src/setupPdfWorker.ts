// Configure pdf.js worker for react-pdf
import { pdfjs } from 'react-pdf'
// Prefer a locally bundled worker to avoid network/CORS/CDN issues
// Vite will resolve this to a static asset URL at build time
// Ensure the installed pdfjs-dist version matches react-pdf peer requirements
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url'
pdfjs.GlobalWorkerOptions.workerSrc = workerUrl as unknown as string
