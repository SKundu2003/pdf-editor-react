import React, { useEffect, useRef, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import { usePdfState } from '../hooks/usePdfState';

interface PdfViewerProps {
  pdfBytes: Uint8Array | null;
  onDocumentLoaded?: (pageCount: number) => void;
  mode: 'select' | 'text';
  textColor: string;
  textSize: number;
  previewAnnotations: any[];
  handleTextEdit?: (edit: {
    oldText: string;
    newText: string;
    pageNumber: number;
  }) => void;
}

const PdfViewer = ({
  pdfBytes,
  onDocumentLoaded,
  mode,
  textColor,
  textSize,
  previewAnnotations,
  handleTextEdit,
}: PdfViewerProps) => {
  const viewerDiv = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<any>(null);
  const { onDocumentLoad } = usePdfState();
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const element = viewerDiv.current;
    if (!element) {
      return;
    }

    if (instanceRef.current) {
      return;
    }

    WebViewer(
      {
        path: '/lib/webviewer',
        licenseKey:
          import.meta.env.VITE_PDFTRON_LICENSE_KEY ||
          (import.meta.env.DEV
            ? 'demo:1757879970041:6045741f0300000000c1c10a42adeff7132c88744a5bed804c8c678ad5'
            : ''),
        fullAPI: true,
        enableFilePicker: false,
        enableRedaction: true,
        enableMeasurement: false,
        enableAnnotations: true,
      },
      element
    )
      .then((instance) => {
        instanceRef.current = instance;
        const { Core } = instance;
        const { documentViewer, annotationManager } = Core;

        // When the user edits text, it creates a 'FreeText' annotation.
        // We can listen for that change to get the new text.
        annotationManager.addEventListener('annotationChanged', (annotations, action, { imported }) => {
          // Don't run this on the initial import of annotations
          if (imported) {
            return;
          }

          if (action === 'modify') {
            annotations.forEach(annot => {
              if (annot instanceof Core.Annotations.FreeTextAnnotation) {
                // You can access the new text with annot.getContents()
                // and handle it here if needed.
                console.log('Text edited:', annot.getContents());
              }
            });
          }
        });

        documentViewer.addEventListener('documentLoaded', () => {
          try {
            const pageCount = documentViewer.getPageCount();
            onDocumentLoad(pageCount);
            onDocumentLoaded?.(pageCount);
          } catch (error) {
            console.error('Error in documentLoaded handler:', error);
          }
        });

        if (pdfBytes) {
          try {
            const arr = new Uint8Array(pdfBytes);
            const blob = new Blob([arr], { type: 'application/pdf' });
            documentViewer.loadDocument(blob);
          } catch (error) {
            console.error('Error loading document:', error);
          }
        }
      })
      .catch((error) => {
        console.error('WebViewer initialization failed:', error);
        setInitError(error.message || 'Failed to initialize WebViewer');
      });

    return () => {
      if (instanceRef.current) {
        try {
          instanceRef.current.dispose();
          instanceRef.current = null;
        } catch (error) {
          console.error('Error during cleanup:', error);
        }
      }
    };
  }, []);

  // Effect to load a new document when the pdfBytes prop changes
  useEffect(() => {
    const instance = instanceRef.current;
    if (!instance || !pdfBytes) return;
    try {
      const arr = new Uint8Array(pdfBytes);
      const blob = new Blob([arr], { type: 'application/pdf' });
      instance.Core.documentViewer.loadDocument(blob);
    } catch (error) {
      console.error('Error reloading document:', error);
    }
  }, [pdfBytes]);

  // Effect to switch between editing and selection mode
  useEffect(() => {
    const instance = instanceRef.current;
    if (!instance) return;

    try {
      const { UI } = instance;
      const { documentViewer, annotationManager } = instance.Core;

      if (mode === 'text') {
        // Enter text editing mode
        annotationManager.disableReadOnlyMode();
        documentViewer.setToolMode(documentViewer.getTool('AnnotationEdit'));
        UI.setToolMode('AnnotationEdit');
      } else {
        // Enter selection/pan mode
        annotationManager.enableReadOnlyMode();
        documentViewer.setToolMode(documentViewer.getTool('Pan'));
        UI.setToolMode('Pan');
      }
    } catch (error) {
      console.error('Error handling mode change:', error);
    }
  }, [mode]);

  // Effect to update text style (color and size)
  useEffect(() => {
    const instance = instanceRef.current;
    if (!instance) return;
    try {
      const { annotationManager } = instance.Core;
      const freeTextDefaults = annotationManager.getAnnotationDisplayAuthorAndColor('FreeText');
      freeTextDefaults.textColor = new instance.Core.Annotations.Color(textColor);
      freeTextDefaults.fontSize = `${textSize}px`;
      annotationManager.setAnnotationDisplayAuthorAndColor('FreeText', freeTextDefaults);
    } catch (error) {
      console.error('Error updating annotation styles:', error);
    }
  }, [textColor, textSize]);

  // Effect to load annotations
  useEffect(() => {
    const instance = instanceRef.current;
    if (!instance) return;
    try {
      const { annotationManager } = instance.Core;
      annotationManager.importAnnotations(previewAnnotations);
    } catch (error) {
      console.error('Error importing annotations:', error);
    }
  }, [previewAnnotations]);

  return (
    <div className="h-full w-full">
      {initError ? (
        <div className="h-full w-full flex items-center justify-center bg-red-50 border border-red-200 rounded-lg">
          <div className="text-center p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">WebViewer Initialization Failed</h3>
            <p className="text-red-600 mb-4">{initError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      ) : (
        <div
          key="webviewer-container"
          className="webviewer h-full w-full"
          ref={viewerDiv}
        />
      )}
    </div>
  );
};

export default PdfViewer;