import { Link, NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/60 dark:bg-slate-900/60 border-b border-slate-200/40 dark:border-slate-700/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary-500 text-white">PDF</span>
          <span className="hidden sm:block">Converter & Editor</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <NavLink to="/" className={({isActive}) => `hover:text-primary-600 ${isActive ? 'text-primary-600' : ''}`}>Home</NavLink>
          <NavLink to="/editor" className={({isActive}) => `hover:text-primary-600 ${isActive ? 'text-primary-600' : ''}`}>Editor</NavLink>
          <a href="https://react-pdf.org/" target="_blank" rel="noreferrer" className="hidden sm:inline hover:text-primary-600">Docs</a>
        </nav>
      </div>
    </header>
  )
}
