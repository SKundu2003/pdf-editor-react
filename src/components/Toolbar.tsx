import { useRef } from 'react'

export type ToolbarProps = {
  onOpenFiles: (files: File[]) => void
  onZoomIn: () => void
  onZoomOut: () => void
  onResetZoom: () => void
  pageNumber: number
  numPages: number
  setPageNumber: (n: number) => void
  mode: 'select' | 'text'
  setMode: (m: 'select' | 'text') => void
  textColor: string
  setTextColor: (c: string) => void
  textSize: number
  setTextSize: (s: number) => void
  onExport: () => Promise<void>
  onClearAll?: () => void
  canExport?: boolean
}

export default function Toolbar({
  onOpenFiles,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  pageNumber,
  numPages,
  setPageNumber,
  mode,
  setMode,
  textColor,
  setTextColor,
  textSize,
  setTextSize,
  onExport,
  onClearAll,
  canExport = true
}: ToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onOpenFiles(Array.from(files))
      // Reset the input value to allow selecting the same file again
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  return (
    <div className="w-full border-b border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 backdrop-blur sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="file"
              ref={inputRef}
              className="hidden"
              accept=".pdf,application/pdf"
              multiple
              onChange={handleFileChange}
            />
            <button
              className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              onClick={() => inputRef.current?.click()}
            >
              Open PDFs
            </button>

            <button
              className={`px-3 py-2 rounded-md border ${mode === 'text' ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              onClick={() => setMode(mode === 'text' ? 'select' : 'text')}
              title={mode === 'text' ? 'Switch to select mode (Esc)' : 'Switch to text mode'}
            >
              {mode === 'text' ? 'Select Mode' : 'Text Mode'}
            </button>

            {mode === 'text' && (
              <div className="absolute left-0 mt-1 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-10 flex items-center gap-1">
                <div className="flex items-center border-r border-slate-200 dark:border-slate-700 pr-2 mr-1">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-6 h-6 cursor-pointer bg-transparent border-0 appearance-none"
                    title="Text color"
                  />
                  <span className="ml-1 text-xs text-slate-500 dark:text-slate-400">
                    {textSize}px
                  </span>
                </div>

                <button
                  type="button"
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                  onClick={() => setTextSize(Math.max(8, textSize - 1))}
                  title="Decrease font size"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                  onClick={() => setTextSize(Math.min(72, textSize + 1))}
                  title="Increase font size"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {onClearAll && (
            <button
              onClick={onClearAll}
              className="px-3 py-2 rounded-md border border-red-500 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
              title="Clear all PDFs"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="h-6 w-px bg-slate-300/80 dark:bg-slate-700/80" />
        <div className="inline-flex rounded-md border border-slate-300 dark:border-slate-700 overflow-hidden">
          <button className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800" onClick={onZoomOut}>-</button>
          <button className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800" onClick={onResetZoom}>100%</button>
          <button className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800" onClick={onZoomIn}>+</button>
        </div>

        <div className="h-6 w-px bg-slate-300/80 dark:bg-slate-700/80" />
        <div className="flex items-center gap-2">
          <button onClick={()=> setMode('select')} className={`px-3 py-2 rounded-md border ${mode==='select' ? 'border-primary-500 text-primary-600' : 'border-slate-300 dark:border-slate-700'} hover:bg-slate-50 dark:hover:bg-slate-800`}>Select</button>
          <button onClick={()=> setMode('text')} className={`px-3 py-2 rounded-md border ${mode==='text' ? 'border-primary-500 text-primary-600' : 'border-slate-300 dark:border-slate-700'} hover:bg-slate-50 dark:hover:bg-slate-800`}>Text</button>
          {mode==='text' && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600 dark:text-slate-300">Color</label>
              <input type="color" value={textColor} onChange={(e)=> setTextColor(e.target.value)} className="h-8 w-10 p-0 border border-slate-300 dark:border-slate-700 rounded" />
              <label className="text-sm text-slate-600 dark:text-slate-300">Size</label>
              <input type="number" min={6} max={72} value={textSize} onChange={(e)=> setTextSize(Number(e.target.value)||14)} className="w-20 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-transparent" />
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-300/80 dark:bg-slate-700/80" />
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800" onClick={()=> setPageNumber(Math.max(1, pageNumber-1))}>Prev</button>
          <span className="text-sm">Page {pageNumber} / {numPages || '-'}</span>
          <button className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800" onClick={()=> setPageNumber(Math.min(numPages, pageNumber+1))} disabled={!numPages}>Next</button>
        </div>

        <div className="h-6 w-px bg-slate-300/80 dark:bg-slate-700/80" />
        <div className="flex-1" />
        <button
          className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onExport}
          disabled={!canExport}
        >
          Export PDF
        </button>
      </div>
    </div>
  )
}
