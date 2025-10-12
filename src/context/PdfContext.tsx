
import React, { createContext, useContext } from 'react';
import { usePdfState } from '../hooks/usePdfState';

type PdfState = ReturnType<typeof usePdfState>;

const PdfContext = createContext<PdfState | null>(null);

export const usePdf = () => {
  const context = useContext(PdfContext);
  if (!context) {
    throw new Error('usePdf must be used within a PdfProvider');
  }
  return context;
};

export const PdfProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pdfState = usePdfState();
  return <PdfContext.Provider value={pdfState}>{children}</PdfContext.Provider>;
};

