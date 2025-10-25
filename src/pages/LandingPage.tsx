import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import UploadDropzone from '../components/UploadDropzone'
import { usePdf } from '../context/PdfContext'
import { useEffect } from 'react'

export default function LandingPage() {
  const navigate = useNavigate()
  const { loadFromFiles } = usePdf()

  // SEO: Update document title and meta description
  useEffect(() => {
    document.title = 'Free PDF Editor & Converter Online - Edit, Merge, Convert PDFs | Bright Linx'
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Edit PDF online free. Convert, merge, compress, and edit PDF files instantly in your browser. No registration required. Fast, secure, and completely free PDF editor with no limits.')
    }
  }, [])

  const handleFilesSelected = async (files: File[]) => {
    try {
      await loadFromFiles(files)
      navigate('/editor')
    } catch (error) {
      console.error('Error loading files:', error)
      // Handle error appropriately in the UI
    }
  }

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-40 blur-3xl pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary-300"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-fuchsia-300"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.h1 initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.6}} className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Edit, Merge, and Convert PDFs in Your Browser
            </motion.h1>
            <motion.p initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.1,duration:0.6}} className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              A modern, privacy-friendly PDF tool to upload, view, annotate, rearrange pages, and export — no server required.
            </motion.p>
            <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.2,duration:0.6}} className="mt-8 flex flex-wrap gap-3">
              <Link to="/editor" className="px-5 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition shadow-lg shadow-primary-200">Get Started</Link>
              <a href="#upload" className="px-5 py-3 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition shadow-md">Upload PDF</a>
            </motion.div>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
              <Feature title="Privacy-first" text="All editing happens locally in your browser." />
              <Feature title="Fast & smooth" text="GPU-accelerated viewing with polished UX." />
              <Feature title="Free & simple" text="No account. No watermark. Just works." />
            </div>
          </div>
          <motion.div initial={{opacity:0,scale:0.98}} animate={{opacity:1,scale:1}} transition={{delay:0.1,duration:0.6}} className="relative rounded-2xl border border-yellow-200/60 dark:border-yellow-700/40 bg-yellow-50/70 dark:bg-slate-900/50 shadow-xl p-4">
            <div className="aspect-video rounded-lg bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center text-center p-6">
              <div>
                <p className="text-xl font-semibold text-slate-900 dark:text-white">Live Preview</p>
                <p className="mt-2 text-slate-700 dark:text-slate-300">Upload a PDF and jump straight into the editor.</p>
              </div>
            </div>
            <div className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-tr from-yellow-400/20 to-amber-400/20 blur-xl"></div>
          </motion.div>
        </div>
      </section>

      <section id="upload" className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold mb-4">Try it now</h2>
        <UploadDropzone onFilesSelected={handleFilesSelected} />
      </section>

      {/* SEO Content Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 bg-white dark:bg-slate-900">
        <div className="prose dark:prose-invert max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">The Best Free Online PDF Editor & Converter</h2>
          
          <p className="text-lg mb-4">
            <strong>Bright Linx PDF Editor</strong> is your complete solution for editing PDF files online. Whether you need to edit PDF text, merge multiple PDFs, convert PDF to Word, or compress large files, our powerful yet simple tools have you covered.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Why Choose Our PDF Editor?</h3>
          <ul className="space-y-2 mb-6">
            <li><strong>100% Free:</strong> No hidden costs, no subscription fees, unlimited usage</li>
            <li><strong>No Watermarks:</strong> Your documents stay clean and professional</li>
            <li><strong>Privacy First:</strong> All editing happens in your browser - we never see your files</li>
            <li><strong>No Registration:</strong> Start editing immediately without creating an account</li>
            <li><strong>Fast & Modern:</strong> Built with cutting-edge technology for lightning-fast performance</li>
            <li><strong>All Devices:</strong> Works on desktop, tablet, and mobile browsers</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Powerful PDF Editing Features</h3>
          <p className="mb-4">
            Our online PDF editor lets you <strong>edit PDF text directly</strong> - just double-click and start typing like in a word processor. Rearrange pages with drag-and-drop, change text colors and sizes, and export your edited PDF with all changes preserved.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">More Tools Coming Soon</h3>
          <p className="mb-4">
            We're constantly adding new features including <strong>PDF to Word converter</strong>, <strong>merge PDF files</strong>, <strong>compress PDF</strong>, <strong>PDF to Excel</strong>, and more. <Link to="/coming-soon" className="text-primary-600 hover:underline">See what's coming</Link>.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">How to Edit a PDF Online</h3>
          <ol className="space-y-2 mb-6">
            <li><strong>1. Upload:</strong> Drag and drop your PDF file or click to select</li>
            <li><strong>2. Edit:</strong> Click "Text" mode and double-click any text to edit</li>
            <li><strong>3. Customize:</strong> Change colors, sizes, rearrange pages</li>
            <li><strong>4. Download:</strong> Click "Export" to download your edited PDF</li>
          </ol>

          <p className="text-lg font-medium mt-8">
            Start editing your PDF files today - no software installation required!
          </p>
        </div>
      </section>
    </div>
  )
}

function Feature({title, text}:{title:string; text:string}){
  return (
    <div className="p-4 rounded-lg border border-slate-200/60 dark:border-slate-700/40 bg-white/50 dark:bg-slate-900/40">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-slate-600 dark:text-slate-300">{text}</p>
    </div>
  )
}
