import React from 'react'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FileText, GripVertical } from 'lucide-react'
import { useEditorStore } from '../../store/editorStore'
import { cn } from '../../utils/cn'
import type { PageInfo } from '../../types/editor'

export default function PageReorder() {
  const { pageOrder, reorderPages, generatePageOrder } = useEditorStore()

  React.useEffect(() => {
    generatePageOrder()
  }, [generatePageOrder])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (active.id !== over?.id && pageOrder) {
      const oldIndex = pageOrder.pages.findIndex(p => p.id === active.id)
      const newIndex = pageOrder.pages.findIndex(p => p.id === over?.id)
      
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderPages(oldIndex, newIndex)
      }
    }
  }

  if (!pageOrder || pageOrder.pages.length === 0) {
    return (
      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
          No pages to reorder
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Page Order</h3>
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {pageOrder.totalPages} pages
        </span>
      </div>

      <div className="max-h-96 overflow-auto space-y-2">
        <DndContext onDragEnd={handleDragEnd}>
          <SortableContext items={pageOrder.pages.map(p => p.id)} strategy={verticalListSortingStrategy}>
            {pageOrder.pages.map((page, index) => (
              <PageItem key={page.id} page={page} index={index} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}

function PageItem({ page, index }: { page: PageInfo; index: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-all',
        isDragging && 'shadow-lg scale-105 z-50'
      )}
    >
      {/* Drag Handle */}
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing flex-shrink-0">
        <GripVertical className="h-4 w-4 text-slate-400" />
      </div>

      {/* Page Icon */}
      <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />

      {/* Page Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">Page {index + 1}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            ({page.fileName} - p.{page.pageNumber})
          </span>
        </div>
      </div>

      {/* Global Index */}
      <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
        #{index + 1}
      </div>
    </div>
  )
}