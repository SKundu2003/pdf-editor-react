import { useEffect, useRef } from 'react'
import { useEditorStore } from '../store/editorStore'
import { useToast } from '../components/UI/Toast'

interface AutoSaveOptions {
  enabled: boolean
  interval: number // milliseconds
  showNotifications: boolean
}

export function useAutoSave(options: AutoSaveOptions = {
  enabled: true,
  interval: 30000, // 30 seconds
  showNotifications: false
}) {
  const { editedContent, hasUnsavedChanges, markAsSaved } = useEditorStore()
  const { addToast } = useToast()
  const lastSavedContent = useRef<string>('')
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (!options.enabled || !hasUnsavedChanges) return

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      if (editedContent !== lastSavedContent.current) {
        // Save to localStorage as backup
        localStorage.setItem('pdf-editor-backup', editedContent)
        lastSavedContent.current = editedContent
        markAsSaved()

        if (options.showNotifications) {
          addToast({
            title: 'Auto-saved',
            description: 'Your changes have been saved automatically',
            variant: 'success',
            duration: 2000
          })
        }
      }
    }, options.interval)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [editedContent, hasUnsavedChanges, options, markAsSaved, addToast])

  // Load backup on mount
  useEffect(() => {
    const backup = localStorage.getItem('pdf-editor-backup')
    if (backup && backup !== editedContent) {
      // Could show a dialog asking if user wants to restore backup
      console.log('Backup found:', backup.substring(0, 100) + '...')
    }
  }, [editedContent])

  return {
    hasBackup: !!localStorage.getItem('pdf-editor-backup'),
    clearBackup: () => localStorage.removeItem('pdf-editor-backup')
  }
}