import { useEffect, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";

// Tell pdf.js where to find its worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface TextEditorProps {
  file: File;
}

interface TextItem {
  str: string;
  transform: number[];
  fontSize?: number;
  color?: string;
}
export default function TextEditor({ file }: TextEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [textContent, setTextContent] = useState<TextItem[]>([]);
  const [editedText, setEditedText] = useState<{[key: string]: string}>({});
  const [hasEdits, setHasEdits] = useState(false);

  // Update hasEdits when editedText changes
  useEffect(() => {
    setHasEdits(Object.keys(editedText).length > 0);
  }, [editedText]);
  useEffect(() => {
    const loadPdf = async () => {
      try {
        const reader = new FileReader();
        reader.onload = async () => {
          if (!reader.result) return;
          const typedArray = new Uint8Array(reader.result as ArrayBuffer);
          const loadedPdf = await pdfjsLib.getDocument(typedArray).promise;
          setPdf(loadedPdf);
        };
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };
    loadPdf();
  }, [file]);

  // Render current page
  useEffect(() => {
    if (!pdf || !canvasRef.current) return;
    const renderPage = async () => {
      try {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current!;
        const context = canvas.getContext("2d");

        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Extract text content
        const text = await page.getTextContent();
        setTextContent(text.items as TextItem[]);

        // Mask edited text areas on the canvas
        textContent.forEach((item, index) => {
          const key = `${pageNumber}-${index}`;
          if (key in editedText) {
            const x = item.transform[4] * 1.5;
            const y = item.transform[5] * 1.5;
            const width = (item.str.length * (item.fontSize || 12)) * 0.6; // Approximate width
            const height = item.fontSize || 12;
            context.fillStyle = 'white';
            context.fillRect(x, y - height + 2, width, height); // Draw over the text
          }
        });

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;
      } catch (error) {
        console.error('Error rendering page:', error);
      }
    };
    renderPage();
  }, [pdf, pageNumber]);

  const handleTextClick = (item: TextItem, index: number) => {
    const key = `${pageNumber}-${index}`;
    setEditedText((prev) => ({ ...prev, [key]: item.str }));
  };

  const handleTextChange = (index: number, value: string) => {
    const key = `${pageNumber}-${index}`;
    setEditedText((prev) => ({ ...prev, [key]: value }));
  };

  const saveEditedPdf = async () => {
    if (!pdf) return;
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const typedArray = new Uint8Array(reader.result as ArrayBuffer);
        const pdfDoc = await PDFDocument.load(typedArray);
        // Note: PDF-lib doesn't directly edit existing text. This is a placeholder.
        const modifiedPdfBytes = await pdfDoc.save();
        const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'edited.pdf';
        link.click();
        URL.revokeObjectURL(url);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error saving PDF:', error);
    }
  };

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
      <div style={{ position: "relative" }}>
        <canvas ref={canvasRef} className="border shadow-md" />
        {textContent.map((item: TextItem, index: number) => {
          const key = `${pageNumber}-${index}`;
          const isEditing = key in editedText;
          const displayText = editedText[key] || item.str;
          return (
            <div
              key={key}
              style={{
                position: "absolute",
                left: `${item.transform[4] * 1.5}px`,
                top: `${item.transform[5] * 1.5}px`,
                cursor: "pointer",
                backgroundColor: isEditing ? "rgba(0, 0, 255, 0.2)" : "transparent",
                zIndex: isEditing ? 10 : 5,
              }}
              onClick={() => handleTextClick(item, index)}
            >
              {isEditing ? (
                <input
                  value={editedText[key]}
                  onChange={(e) => handleTextChange(index, e.target.value)}
                  onBlur={() => {/* Text is saved on change, no need to delete */}}
                  style={{
                    fontSize: `${item.fontSize || 12}px`,
                    color: item.color || "black",
                    backgroundColor: "white",
                    border: "1px solid blue",
                  }}
                />
              ) : (
                <span
                  style={{
                    fontSize: `${item.fontSize || 12}px`,
                    color: item.color || "black",
                  }}
                >
                  {displayText}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <button onClick={saveEditedPdf} className="mt-2 p-2 bg-blue-500 text-white">Save PDF</button>
    </div>
  );
}
