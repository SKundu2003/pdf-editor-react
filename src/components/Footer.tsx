export default function Footer() {
  return (
    <footer className="border-t border-slate-200/60 dark:border-slate-700/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
        <p>© {new Date().getFullYear()} PDF Converter & Editor</p>
      </div>
    </footer>
  )
}
