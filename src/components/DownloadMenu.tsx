import React, { useState, useRef, useEffect } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

interface DownloadMenuProps {
  onDownloadWithWatermark: () => void
  onDownloadWithoutWatermark: () => void
  disabled?: boolean
}

const DownloadMenu: React.FC<DownloadMenuProps> = ({
  onDownloadWithWatermark,
  onDownloadWithoutWatermark,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleDownloadWithWatermark = () => {
    onDownloadWithWatermark()
    setIsOpen(false)
  }

  const handleDownloadWithoutWatermark = () => {
    onDownloadWithoutWatermark()
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>Download</span>
        <ChevronDownIcon className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-300 rounded-md shadow-lg z-50">
          <button
            onClick={handleDownloadWithWatermark}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-200 flex items-start"
          >
            <div>
              <div className="font-medium text-gray-900">Download with Watermarks</div>
              <div className="text-xs text-gray-500 mt-1">Keep original watermarks in the PDF</div>
            </div>
          </button>

          <button
            onClick={handleDownloadWithoutWatermark}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-start"
          >
            <div>
              <div className="font-medium text-gray-900">Download without Watermarks</div>
              <div className="text-xs text-gray-500 mt-1">Remove watermarks using enhanced PDF.js background detection</div>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}

export default DownloadMenu
