import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-6">
          <div>
            <h3 className="font-semibold text-sm mb-3">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-slate-600 dark:text-slate-400 hover:text-primary-600">About Us</Link></li>
              <li><Link to="/contact" className="text-slate-600 dark:text-slate-400 hover:text-primary-600">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/editor" className="text-slate-600 dark:text-slate-400 hover:text-primary-600">PDF Editor</Link></li>
              <li><Link to="/coming-soon" className="text-slate-600 dark:text-slate-400 hover:text-primary-600">Coming Soon</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/legal" className="text-slate-600 dark:text-slate-400 hover:text-primary-600">Legal</Link></li>
              <li><Link to="/terms" className="text-slate-600 dark:text-slate-400 hover:text-primary-600">Terms of Use</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">Privacy</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="text-slate-600 dark:text-slate-400 hover:text-primary-600">Privacy Policy</Link></li>
              <li><Link to="/privacy-settings" className="text-slate-600 dark:text-slate-400 hover:text-primary-600">Privacy Settings</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © {new Date().getFullYear()} PDF Converter & Editor
            </p>
            <p className="text-sm font-medium text-primary-600 dark:text-primary-400 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9a1 1 0 112 0v4a1 1 0 11-2 0V9zm1-4a1 1 0 100 2 1 1 0 000-2z"/>
              </svg>
              It's Completely free, Powered by Ads
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
