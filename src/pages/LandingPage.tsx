import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import UploadDropzone from '../components/UploadDropzone'

export default function LandingPage() {
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
              <Link to="/editor" className="px-5 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition">Get Started</Link>
              <a href="#upload" className="px-5 py-3 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition">Upload PDF</a>
            </motion.div>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
              <Feature title="Privacy-first" text="All editing happens locally in your browser." />
              <Feature title="Fast & smooth" text="GPU-accelerated viewing with polished UX." />
              <Feature title="Free & simple" text="No account. No watermark. Just works." />
            </div>
          </div>
          <motion.div initial={{opacity:0,scale:0.98}} animate={{opacity:1,scale:1}} transition={{delay:0.1,duration:0.6}} className="relative rounded-2xl border border-slate-200/60 dark:border-slate-700/40 bg-white/70 dark:bg-slate-900/50 shadow-xl p-4">
            <div className="aspect-video rounded-lg bg-gradient-to-br from-primary-100 to-fuchsia-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center text-center p-6">
              <div>
                <p className="text-xl font-semibold">Live Preview</p>
                <p className="mt-2 text-slate-600 dark:text-slate-300">Upload a PDF and jump straight into the editor.</p>
              </div>
            </div>
            <div className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-tr from-primary-400/20 to-fuchsia-400/20 blur-xl"></div>
          </motion.div>
        </div>
      </section>

      <section id="upload" className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold mb-4">Try it now</h2>
        <UploadDropzone redirectToEditor />
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
