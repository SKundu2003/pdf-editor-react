import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { GlobeAltIcon } from '@heroicons/react/24/outline'

export default function Header() {
  const [showLanguages, setShowLanguages] = useState(false)

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/60 dark:bg-slate-900/60 border-b border-slate-200/40 dark:border-slate-700/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-emerald-600 text-white font-bold text-sm shadow-lg">
            BL
          </span>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight">BRIGHT LINK</span>
            <span className="text-xs text-slate-600 dark:text-slate-400">PDF Converter & Editor</span>
          </div>
          <div className="hidden md:flex items-center gap-2 ml-3">
            <span className="px-2 py-1 text-xs font-medium bg-yellow-50 text-yellow-800 border border-yellow-200 rounded">Ivory Free</span>
            <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-800 border border-green-200 rounded">NO Limits</span>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-1 text-sm">
            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
              <span className="text-xs text-slate-500 dark:text-slate-400 mr-2">ALL Tools</span>
              <NavLink to="/" className={({isActive}) => `px-2 py-1 rounded hover:bg-primary-100 dark:hover:bg-primary-900/30 ${isActive ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/50' : ''}`}>Home</NavLink>
              <NavLink to="/editor" className={({isActive}) => `px-2 py-1 rounded hover:bg-primary-100 dark:hover:bg-primary-900/30 ${isActive ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/50' : ''}`}>Editor</NavLink>
              <a href="https://react-pdf.org/" target="_blank" rel="noreferrer" className="px-2 py-1 rounded hover:bg-primary-100 dark:hover:bg-primary-900/30">Docs</a>
            </div>
          </nav>
          <div className="relative">
            <button
              onClick={() => setShowLanguages(!showLanguages)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              title="Languages"
            >
              <GlobeAltIcon className="h-5 w-5" />
            </button>
            {showLanguages && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-2">
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700">English</button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700">Español</button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700">Français</button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700">Deutsch</button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700">中文</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
