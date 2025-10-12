import React from 'react'
import { InformationCircleIcon } from '@heroicons/react/24/outline'

interface TextEditingInstructionsProps {
  mode: 'select' | 'text'
  onTestTextEdit?: () => void
}

const TextEditingInstructions: React.FC<TextEditingInstructionsProps> = ({ mode, onTestTextEdit }) => {
  if (mode !== 'text') return null

  return (
    <div className="absolute bottom-4 left-4 bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-sm shadow-lg z-10">
      <div className="flex items-start space-x-2">
        <InformationCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <h4 className="font-medium text-blue-900 mb-1">How to Edit Text:</h4>
          <ol className="text-blue-800 space-y-1 text-xs">
            <li>1. Click the <strong>Text</strong> button to enter text mode</li>
            <li>2. PDFTron's text editing is now active:</li>
            <li>• <strong>Double-click</strong> on any text to edit it</li>
            <li>• <strong>Click</strong> on empty areas to add new text</li>
            <li>• Use <strong>Backspace/Delete</strong> to remove characters</li>
            <li>• Use <strong>Enter</strong> to create new lines</li>
            <li>3. Use toolbar to change <strong>size</strong> and <strong>color</strong></li>
            <li>4. Press <strong>Escape</strong> to exit text mode</li>
          </ol>
          <p className="text-blue-700 text-xs mt-2 italic">
            Note: This version uses PDFTron's native text editing for better stability.
            To remove demo watermarks, add your license key to the .env file.
          </p>
          {onTestTextEdit && (
            <button
              onClick={onTestTextEdit}
              className="mt-2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
            >
              Test Text Edit
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TextEditingInstructions
