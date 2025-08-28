import { useEffect, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";

// Tell pdf.js where to find its worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface TextEditorProps {
  file: File;
}

export default function TextEditor({ file }: TextEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  // Load PDF on mount
  useEffect(() => {
    const loadPdf = async () => {
      const reader = new FileReader();
      reader.onload = async () => {
        if (!reader.result) return;
        const typedArray = new Uint8Array(reader.result as ArrayBuffer);
        const loadedPdf = await pdfjsLib.getDocument(typedArray).promise;
        setPdf(loadedPdf);
      };
      reader.readAsArrayBuffer(file);
    };
    loadPdf();
  }, [file]);

  // Render current page
  useEffect(() => {
    if (!pdf || !canvasRef.current) return;
    const renderPage = async () => {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (!context) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;
    };
    renderPage();
  }, [pdf, pageNumber]);

  return (
    <div className="p-4">
      <div className="flex justify-between mb-2">
        <button
          onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
          disabled={pageNumber === 1}
        >
          Prev
        </button>
        <span>
          Page {pageNumber} of {pdf?.numPages ?? "?"}
        </span>
        <button
          onClick={() =>
            setPageNumber((p) =>
              pdf ? Math.min(p + 1, pdf.numPages) : p
            )
          }
          disabled={pdf ? pageNumber === pdf.numPages : true}
        >
          Next
        </button>
      </div>
      <canvas ref={canvasRef} className="border shadow-md" />
    </div>
  );
}
