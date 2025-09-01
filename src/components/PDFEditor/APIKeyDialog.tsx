import React, { useState, useEffect } from 'react'
import { Key, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '../UI/Button'
import { isCustomAPIConfigured } from '../../services/adobeAPI'
import { cn } from '../../utils/cn'

interface APIKeyDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

export default function APIKeyDialog({ isOpen, onClose, onSubmit }: APIKeyDialogProps) {
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    setIsConfigured(isCustomAPIConfigured())
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              isConfigured 
                ? "bg-green-100 dark:bg-green-900/30" 
                : "bg-blue-100 dark:bg-blue-900/30"
            )}>
              {isConfigured ? (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <Key className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                {isConfigured ? 'PDF API Configured' : 'PDF API Configuration'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {isConfigured 
                  ? 'Custom PDF Services is ready for use'
                  : 'PDF API endpoint is configured via environment variables'
                }
              </p>
            </div>
          </div>

          {isConfigured ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4 mb-4">
              <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">API Ready</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                You can now convert PDFs to HTML for editing using your custom API.
              </p>
            </div>
          ) : (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-4">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">API Not Configured</span>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                PDF API base URL is missing from environment variables.
              </p>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 mb-4">
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
              Configure your PDF API endpoint:
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Set VITE_PDF_API_BASE_URL in your environment variables
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Close
              </Button>
              {isConfigured && (
                <Button type="submit" className="flex-1">
                  Continue
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}