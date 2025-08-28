import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable'
import { Document, Page } from 'react-pdf'
import type { CSSProperties, ReactNode, FC } from 'react'
import { useMemo } from 'react'

export type PageThumbnailsProps = {
  pdfBytes: Uint8Array
  pageOrder: number[]
  setPageOrder: (order: number[]) => void
  currentPage: number
  onSelectPage: (page: number) => void
}

export default function PageThumbnails({ pdfBytes, pageOrder, setPageOrder, currentPage, onSelectPage }: PageThumbnailsProps) {
  // Memoize data and file once per pdfBytes change
  const data = useMemo(() => new Uint8Array(pdfBytes), [pdfBytes])
  const file = useMemo(() => ({ data }), [data])
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { 
        distance: 10,
        delay: 100,
        tolerance: 5
      }
    })
  )

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = pageOrder.indexOf(active.id as number)
    const newIndex = pageOrder.indexOf(over.id as number)
    if (oldIndex === -1 || newIndex === -1) return
    setPageOrder(arrayMove(pageOrder, oldIndex, newIndex))
  }

  return (
    <div className="w-full h-full overflow-auto p-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
          <Document
            file={file}
            onLoadError={(err)=> { console.error('thumbs Document onLoadError:', err) }}
            onSourceError={(err)=> { console.error('thumbs Document onSourceError:', err) }}
            loading={<div className="h-24 w-full bg-slate-100 animate-pulse rounded" />}
          >
            <SortableContext items={pageOrder} strategy={rectSortingStrategy}>
              {pageOrder.map((pageIndex) => (
                <SortableThumb
                  key={pageIndex}
                  id={pageIndex}
                  isActive={currentPage === pageIndex + 1}
                  onClick={() => onSelectPage(pageIndex + 1)}
                >
                  <Page pageNumber={pageIndex + 1} width={140} renderAnnotationLayer={false} renderTextLayer={false} />
                </SortableThumb>
              ))}
            </SortableContext>
          </Document>
        </div>
      </DndContext>
    </div>
  )
}

type SortableThumbProps = {
  id: number
  isActive: boolean
  onClick: () => void
  children: ReactNode
}

const SortableThumb: FC<SortableThumbProps> = ({ id, isActive, onClick, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id,
    transition: {
      duration: 150,
      easing: 'ease'
    }
  })
  
  const style: CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    position: 'relative',
    cursor: isDragging ? 'grabbing' : 'pointer',
    userSelect: 'none',
    zIndex: isDragging ? 1 : 'auto'
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded border ${isActive ? 'border-primary-500 ring-2 ring-primary-200' : 'border-slate-300 dark:border-slate-700'} bg-white/70 dark:bg-slate-900/50 overflow-hidden`}
      onClick={(e) => {
        if (!isDragging) {
          onClick()
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      {...attributes}
      {...listeners}
    >
      <div className="absolute top-1 right-1 p-1 rounded bg-white/80 dark:bg-slate-800/80 cursor-grab active:cursor-grabbing z-10">
        <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor" className="text-slate-500 dark:text-slate-400">
          <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
        </svg>
      </div>
      {children}
      <div className="px-2 py-1 text-xs text-center text-slate-600 dark:text-slate-300">Page {id + 1}</div>
    </div>
  )
}
