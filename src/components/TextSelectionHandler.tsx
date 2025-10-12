import React, { useState, useRef, useEffect } from 'react'
import { usePdf } from '../context/PdfContext'

interface TextSelectionHandlerProps {
  mode: 'select' | 'text'
  onTextSelect: (text: string, x: number, y: number, width: number, height: number) => void
}

const TextSelectionHandler: React.FC<TextSelectionHandlerProps> = ({ mode, onTextSelect }) => {
  const [isSelecting, setIsSelecting] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode !== 'text' || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsSelecting(true)
    setStartPos({ x, y })
    setCurrentPos({ x, y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSelecting || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setCurrentPos({ x, y })
  }

  const handleMouseUp = () => {
    if (!isSelecting) return

    setIsSelecting(false)

    // Calculate selection area
    const width = Math.abs(currentPos.x - startPos.x)
    const height = Math.abs(currentPos.y - startPos.y)
    const x = Math.min(startPos.x, currentPos.x)
    const y = Math.min(startPos.y, currentPos.y)

    if (width > 10 && height > 10) {
      onTextSelect('New Text', x, y, width, height)
    }
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isSelecting) {
        setIsSelecting(false)
      }
    }

    if (isSelecting) {
      document.addEventListener('mouseup', handleGlobalMouseUp)
      return () => document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [isSelecting])

  if (mode !== 'text') {
    return null
  }

  const selectionWidth = Math.abs(currentPos.x - startPos.x)
  const selectionHeight = Math.abs(currentPos.y - startPos.y)
  const selectionX = Math.min(startPos.x, currentPos.x)
  const selectionY = Math.min(startPos.y, currentPos.y)

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 cursor-text select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {isSelecting && (
        <div
          className="absolute border-2 border-blue-500 bg-blue-100 bg-opacity-30 pointer-events-none"
          style={{
            left: selectionX,
            top: selectionY,
            width: selectionWidth,
            height: selectionHeight,
          }}
        />
      )}
    </div>
  )
}

export default TextSelectionHandler
