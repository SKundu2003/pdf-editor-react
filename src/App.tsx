import React from 'react'
import { ToastProvider } from './components/UI/Toast'
import DocxWorkflow from './components/DocxEditor/DocxWorkflow'
import ErrorBoundary from './components/PDFEditor/ErrorBoundary'

export default function App() {
  return (
    <ToastProvider>
      <ErrorBoundary>
        <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100">
          <DocxWorkflow />
        </div>
      </ErrorBoundary>
    </ToastProvider>
  )
}
