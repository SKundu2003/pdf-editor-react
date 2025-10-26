import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-base mb-4 text-slate-900 dark:text-white">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  to="/about" 
                  className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-base mb-4 text-slate-900 dark:text-white">Tools</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  to="/editor" 
                  className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  PDF Editor
                </Link>
              </li>
              <li>
                <Link 
                  to="/coming-soon" 
                  className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Coming Soon
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-base mb-4 text-slate-900 dark:text-white">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  to="/terms-of-use" 
                  className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-base mb-4 text-slate-900 dark:text-white">Privacy</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  to="/privacy-policy" 
                  className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © {new Date().getFullYear()} Bright Linx Allied Ventures. All rights reserved.
            </p>
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9a1 1 0 112 0v4a1 1 0 11-2 0V9zm1-4a1 1 0 100 2 1 1 0 000-2z"/>
              </svg>
              Free Forever • Powered by Ads
            </p>
          </div>
          <div className="mt-4 text-center space-y-2">
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Your files are processed in your browser. We never upload or store your documents.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              This site is supported by Google AdSense and third-party advertising partners. Visit <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-600">Google Ad Settings</a> to manage preferences.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
