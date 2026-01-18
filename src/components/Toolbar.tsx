import React from 'react'
import {
  DocumentTextIcon,
  CursorArrowRaysIcon,
  PaintBrushIcon,
  SwatchIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowDownTrayIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import DownloadMenu from './DownloadMenu'

interface ToolbarProps {
  onOpenFiles: (files: File[]) => void
  onZoomIn: () => void
  onZoomOut: () => void
  onResetZoom: () => void
  pageNumber: number
  numPages: number
  setPageNumber: (page: number) => void
  mode: 'select' | 'text'
  setMode: (mode: 'select' | 'text') => void
  textColor: string
  setTextColor: (color: string) => void
  textSize: number
  setTextSize: (size: number) => void
  onDownloadWithWatermark: () => void
  onDownloadWithoutWatermark: () => void
  canExport: boolean
  onClearAll?: () => void
}

const Toolbar: React.FC<ToolbarProps> = ({
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
  onDownloadWithWatermark,
  onDownloadWithoutWatermark,
  canExport,
  onClearAll
}) => {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      onOpenFiles(files)
    }
  }

  const textSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32]
  const textColors = [
    '#000000', // Black
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFA500', // Orange
    '#800080', // Purple
    '#008000', // Dark Green
  ]

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left side - File operations */}
        <div className="flex items-center space-x-2">
          <label className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
            <DocumentTextIcon className="w-4 h-4 mr-2" />
            Open PDF
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>

          <DownloadMenu
            onDownloadWithWatermark={onDownloadWithWatermark}
            onDownloadWithoutWatermark={onDownloadWithoutWatermark}
            disabled={!canExport}
          />

          {onClearAll && (
            <button
              onClick={onClearAll}
              className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Clear All
            </button>
          )}
        </div>

        {/* Center - Mode selection */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setMode('select')}
            className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              mode === 'select'
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <CursorArrowRaysIcon className="w-4 h-4 mr-2" />
            Select
          </button>

          <button
            onClick={() => setMode('text')}
            className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              mode === 'text'
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <PaintBrushIcon className="w-4 h-4 mr-2" />
            Text
          </button>
        </div>

        {/* Right side - Text formatting (only show when text mode is active) */}
        {mode === 'text' && (
          <div className="flex items-center space-x-4">
            {/* Text Size */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Size:</span>
              <select
                value={textSize}
                onChange={(e) => setTextSize(Number(e.target.value))}
                className="block w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {textSizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            {/* Text Color */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Color:</span>
              <div className="flex space-x-1">
                {textColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setTextColor(color)}
                    className={`w-6 h-6 rounded border-2 ${
                      textColor === color ? 'border-gray-800' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-8 h-6 border border-gray-300 rounded cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Far right - Zoom and page controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onZoomOut}
            className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <MagnifyingGlassMinusIcon className="w-4 h-4" />
          </button>

          <button
            onClick={onResetZoom}
            className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            100%
          </button>

          <button
            onClick={onZoomIn}
            className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <MagnifyingGlassPlusIcon className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2 ml-4">
            <span className="text-sm text-gray-600">Page</span>
            <input
              type="number"
              min={1}
              max={numPages}
              value={pageNumber}
              onChange={(e) => setPageNumber(Math.min(Math.max(1, parseInt(e.target.value) || 1), numPages))}
              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">of {numPages}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Toolbar
