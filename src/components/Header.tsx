import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { GlobeAltIcon } from '@heroicons/react/24/outline'

export default function Header() {
  const [showLanguages, setShowLanguages] = useState(false)

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src="/brightlinx-logo-new.jpg" 
            alt="BrightLinx Logo" 
            className="h-20 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-lg"
          />
          <div className="flex flex-col gap-1">
            <img 
              src="/brightlinx-name.jpg" 
              alt="BRIGHTLINX" 
              className="h-8 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium uppercase tracking-wider">PDF Converter & Editor</span>
          </div>
          <div className="hidden lg:flex items-center gap-2 ml-4">
            <span className="px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-yellow-400 to-amber-400 text-yellow-900 rounded-full shadow-md hover:shadow-lg transition-shadow">Ivory Free</span>
            <span className="px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-emerald-400 to-green-400 text-green-900 rounded-full shadow-md hover:shadow-lg transition-shadow">NO Limits</span>
          </div>
        </Link>
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-2 text-sm font-medium">
            <NavLink 
              to="/" 
              className={({isActive}) => `px-4 py-2 rounded-lg transition-all duration-300 ${isActive ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              Home
            </NavLink>
            <NavLink 
              to="/editor" 
              className={({isActive}) => `px-4 py-2 rounded-lg transition-all duration-300 ${isActive ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              Editor
            </NavLink>
            <NavLink 
              to="/coming-soon" 
              className={({isActive}) => `px-4 py-2 rounded-lg transition-all duration-300 ${isActive ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              All Tools
            </NavLink>
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
