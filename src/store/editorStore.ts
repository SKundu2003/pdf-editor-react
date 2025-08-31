import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { PDFFile, MergedPDF, ConvertedContent, EditorState, APIProgress, PageInfo, PageOrder } from '../types/editor'
import { getAdobeAPI } from '../services/adobeAPI'
import { PDFPageService } from '../services/pdfPageService'

interface EditorStore extends EditorState {
  // PDF Management
  uploadPdfs: (files: File[]) => Promise<void>
  removePdf: (id: string) => void
  removeAllPdfs: () => void
  updatePdfStatus: (id: string, status: PDFFile['status'], error?: string) => void
  reorderFiles: (startIndex: number, endIndex: number) => void
  toggleFileSelection: (id: string) => void
  selectAllFiles: () => void
  deselectAllFiles: () => void
  mergeSelectedFiles: () => Promise<void>
  
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
  setCurrentPdf: (pdf: PDFFile | MergedPDF | null) => void
  resetEditor: () => void
}

const initialState: EditorState = {
  uploadedFiles: [],
  mergedPdf: null,
  currentPdf: null,
  convertedContent: null,
  isEditing: false,
  hasUnsavedChanges: false,
  editedContent: '',
  apiStatus: 'idle',
  apiError: null,
  selectedFiles: [],
  draggedFile: null
}

export const useEditorStore = create<EditorStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,
    
    uploadPdfs: async (files: File[]) => {
      const newFiles: PDFFile[] = files.map((file, index) => ({
        id: Math.random().toString(36).substring(2, 9),
        file,
        name: file.name,
        size: file.size,
        pageCount: 0,
        uploadProgress: 0,
        status: 'uploading' as const,
        order: get().uploadedFiles.length + index,
        selected: false
      }))
      
      set(state => ({
        uploadedFiles: [...state.uploadedFiles, ...newFiles]
      }))

      // Process each file
      for (const pdfFile of newFiles) {
        try {
          // Simulate upload progress
          for (let i = 0; i <= 100; i += 10) {
            await new Promise(resolve => setTimeout(resolve, 30))
            set(state => ({
              uploadedFiles: state.uploadedFiles.map(f => 
                f.id === pdfFile.id ? { ...f, uploadProgress: i } : f
              )
            }))
          }
          
          // Get page count using pdf-lib
          const arrayBuffer = await pdfFile.file.arrayBuffer()
          const { PDFDocument } = await import('pdf-lib')
          const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
          const pageCount = pdfDoc.getPageCount()
          
          set(state => ({
            uploadedFiles: state.uploadedFiles.map(f => 
              f.id === pdfFile.id ? { ...f, pageCount, status: 'ready' as const } : f
            )
          }))
        } catch (error) {
          console.error('PDF upload failed:', error)
          set(state => ({
            uploadedFiles: state.uploadedFiles.map(f => 
              f.id === pdfFile.id ? { 
                ...f, 
                status: 'error' as const, 
                error: 'Failed to process PDF file' 
              } : f
            )
          }))
        }
      }
      
      // Generate page order after all files are processed
      setTimeout(() => {
        const state = get()
        const allReady = state.uploadedFiles.every(f => f.status === 'ready' || f.status === 'error')
        if (allReady) {
          state.generatePageOrder()
        }
      }, 500)
    },
    
    removePdf: (id: string) => {
      set(state => {
        const newFiles = state.uploadedFiles.filter(f => f.id !== id)
        const newSelected = state.selectedFiles.filter(s => s !== id)
        
        return {
          uploadedFiles: newFiles,
          selectedFiles: newSelected,
          currentPdf: state.currentPdf && 'id' in state.currentPdf && state.currentPdf.id === id ? null : state.currentPdf
        }
      })
    },
    
    removeAllPdfs: () => {
      set({ 
        uploadedFiles: [],
        mergedPdf: null,
        currentPdf: null,
        selectedFiles: [],
        convertedContent: null, 
        editedContent: '', 
        hasUnsavedChanges: false,
        isEditing: false 
      })
    },
    
    updatePdfStatus: (id: string, status, error) => {
      set(state => ({
        uploadedFiles: state.uploadedFiles.map(f => 
          f.id === id ? { ...f, status, error } : f
        )
      }))
    },
    
    reorderFiles: (startIndex: number, endIndex: number) => {
      set(state => {
        const files = [...state.uploadedFiles]
        const [removed] = files.splice(startIndex, 1)
        files.splice(endIndex, 0, removed)
        
        // Update order property
        const reorderedFiles = files.map((file, index) => ({
          ...file,
          order: index
        }))
        
        return { uploadedFiles: reorderedFiles }
      })
    },
    
    toggleFileSelection: (id: string) => {
      set(state => {
        const isSelected = state.selectedFiles.includes(id)
        return {
          selectedFiles: isSelected 
            ? state.selectedFiles.filter(s => s !== id)
            : [...state.selectedFiles, id]
        }
      })
    },
    
    selectAllFiles: () => {
      set(state => ({
        selectedFiles: state.uploadedFiles.map(f => f.id)
      }))
    },
    
    deselectAllFiles: () => {
      set({ selectedFiles: [] })
    },
    
    mergeSelectedFiles: async () => {
      const state = get()
      
      let filesToMerge: PDFFile[]
      
      if (state.pageOrder && state.pageOrder.pages.length > 0) {
        // Use page order for merging
        const uniqueFileIds = [...new Set(state.pageOrder.pages.map(p => p.fileId))]
        filesToMerge = state.uploadedFiles.filter(f => 
          uniqueFileIds.includes(f.id) && f.status === 'ready'
        )
      } else {
        // Fallback to selected files
        filesToMerge = state.uploadedFiles.filter(f => 
          state.selectedFiles.includes(f.id) && f.status === 'ready'
        )
      }
      
      if (filesToMerge.length < 1) {
        throw new Error('Please select at least 2 files to merge')
      }
      
      const mergedPdf: MergedPDF = {
        id: Math.random().toString(36).substring(2, 9),
        name: `Merged_${filesToMerge.length}_files.pdf`,
        files: filesToMerge,
        pageCount: state.pageOrder?.totalPages || filesToMerge.reduce((sum, f) => sum + f.pageCount, 0),
        status: 'merging'
      }
      
      set({ mergedPdf })
      
      try {
        let bytes: Uint8Array
        
        if (state.pageOrder && state.pageOrder.pages.length > 0) {
          // Create PDF with custom page order
          const { pdfDocuments } = await PDFPageService.extractAllPages(filesToMerge)
          bytes = await PDFPageService.createReorderedPDF(state.pageOrder.pages, pdfDocuments)
        } else {
          // Standard merge
          const api = getAdobeAPI()
          bytes = await api.mergePdfs(
            filesToMerge.map(f => f.file),
            (progress) => {
              // Progress updates handled by components
            }
          )
        }
        
        set(state => ({
          mergedPdf: state.mergedPdf ? {
            ...state.mergedPdf,
            bytes,
            status: 'ready'
          } : null
        }))
      } catch (error) {
        set(state => ({
          mergedPdf: state.mergedPdf ? {
            ...state.mergedPdf,
            status: 'error',
            error: error instanceof Error ? error.message : 'Merge failed'
          } : null
        }))
        throw error
      }
    },
    
    setCurrentPdf: (pdf) => {
      set({ currentPdf: pdf })
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