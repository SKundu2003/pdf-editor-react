import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { PDFFile, ConvertedContent, EditorState, APIProgress } from '../types/editor'

interface EditorStore extends EditorState {
  // PDF Management
  uploadPdf: (file: File) => Promise<void>
  removePdf: () => void
  updatePdfStatus: (status: PDFFile['status'], error?: string) => void
  
  // Content Management
  setConvertedContent: (content: ConvertedContent) => void
  updateEditedContent: (content: string) => void
  markAsEdited: () => void
  markAsSaved: () => void
  
  // API Status
  setApiStatus: (status: EditorState['apiStatus'], error?: string) => void
  setApiProgress: (progress: APIProgress | null) => void
  
  // Editor State
  setEditingMode: (editing: boolean) => void
  resetEditor: () => void
}

const initialState: EditorState = {
  currentPdf: null,
  convertedContent: null,
  isEditing: false,
  hasUnsavedChanges: false,
  editedContent: '',
  apiStatus: 'idle',
  apiError: null
}

export const useEditorStore = create<EditorStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,
    
    uploadPdf: async (file: File) => {
      const pdfFile: PDFFile = {
        id: Math.random().toString(36).substring(2, 9),
        file,
        name: file.name,
        size: file.size,
        pageCount: 0,
        uploadProgress: 0,
        status: 'uploading'
      }
      
      set({ currentPdf: pdfFile })
      
      try {
        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 50))
          set(state => ({
            currentPdf: state.currentPdf ? {
              ...state.currentPdf,
              uploadProgress: i
            } : null
          }))
        }
        
        // Get page count using pdf-lib
        const arrayBuffer = await file.arrayBuffer()
        const { PDFDocument } = await import('pdf-lib')
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
        const pageCount = pdfDoc.getPageCount()
        
        set(state => ({
          currentPdf: state.currentPdf ? {
            ...state.currentPdf,
            pageCount,
            status: 'ready'
          } : null
        }))
      } catch (error) {
        console.error('PDF upload failed:', error)
        set(state => ({
          currentPdf: state.currentPdf ? {
            ...state.currentPdf,
            status: 'error',
            error: 'Failed to process PDF file'
          } : null
        }))
      }
    },
    
    removePdf: () => {
      set({ 
        currentPdf: null, 
        convertedContent: null, 
        editedContent: '', 
        hasUnsavedChanges: false,
        isEditing: false 
      })
    },
    
    updatePdfStatus: (status, error) => {
      set(state => ({
        currentPdf: state.currentPdf ? {
          ...state.currentPdf,
          status,
          error
        } : null
      }))
    },
    
    setConvertedContent: (content) => {
      set({ 
        convertedContent: content, 
        editedContent: content.html,
        isEditing: true 
      })
    },
    
    updateEditedContent: (content) => {
      set({ 
        editedContent: content, 
        hasUnsavedChanges: true 
      })
    },
    
    markAsEdited: () => {
      set({ hasUnsavedChanges: true })
    },
    
    markAsSaved: () => {
      set({ hasUnsavedChanges: false })
    },
    
    setApiStatus: (status, error) => {
      set({ apiStatus: status, apiError: error || null })
    },
    
    setApiProgress: (progress) => {
      // Progress updates can be handled by components subscribing to this store
    },
    
    setEditingMode: (editing) => {
      set({ isEditing: editing })
    },
    
    resetEditor: () => {
      set(initialState)
    }
  }))
)