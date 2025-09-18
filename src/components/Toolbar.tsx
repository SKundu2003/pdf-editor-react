import React from 'react'
import { usePdfState } from '../hooks/usePdfState'

export default function Toolbar() {
  const { currentPdfName } = usePdfState()

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200">
      <div className="flex items-center space-x-2">
        <span className="text-gray-600">{currentPdfName || 'No file selected'}</span>
      </div>
    </div>
  )
}
