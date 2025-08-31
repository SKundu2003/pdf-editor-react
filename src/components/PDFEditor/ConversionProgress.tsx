import React from 'react'
import { FileText, Download, Loader2 } from 'lucide-react'
import { Progress } from '../UI/Progress'
import type { APIProgress } from '../../types/editor'

interface ConversionProgressProps {
  progress: APIProgress
  isVisible: boolean
}

export default function ConversionProgress({ progress, isVisible }: ConversionProgressProps) {
  if (!isVisible) return null

  const getStageIcon = (stage: APIProgress['stage']) => {
    switch (stage) {
      case 'uploading':
        return <Upload className="h-5 w-5 text-blue-600" />
      case 'converting':
        return <FileText className="h-5 w-5 text-purple-600" />
      case 'processing':
        return <Loader2 className="h-5 w-5 text-orange-600 animate-spin" />
      case 'downloading':
        return <Download className="h-5 w-5 text-green-600" />
      default:
        return <Loader2 className="h-5 w-5 animate-spin" />
    }
  }

  const getStageColor = (stage: APIProgress['stage']) => {
    switch (stage) {
      case 'uploading':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
      case 'converting':
        return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
      case 'processing':
        return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
      case 'downloading':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      default:
        return 'bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      
      <div className={cn(
        'relative rounded-xl shadow-xl border p-6 w-full max-w-md mx-4',
        getStageColor(progress.stage)
      )}>
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            {getStageIcon(progress.stage)}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-1">
              {progress.stage === 'uploading' && 'Uploading PDF'}
              {progress.stage === 'converting' && 'Converting to HTML'}
              {progress.stage === 'processing' && 'Processing Content'}
              {progress.stage === 'downloading' && 'Preparing Download'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {progress.message}
            </p>
          </div>

          <div className="space-y-2">
            <Progress value={progress.progress} className="w-full" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {progress.progress}% complete
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Import Upload icon
import { Upload } from 'lucide-react'