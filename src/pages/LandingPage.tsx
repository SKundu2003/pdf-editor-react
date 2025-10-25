import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import UploadDropzone from '../components/UploadDropzone'
import { usePdf } from '../context/PdfContext'
import { useEffect } from 'react'
import { 
  ShieldCheckIcon, 
  BoltIcon, 
  GiftIcon, 
  CheckCircleIcon,
  LockClosedIcon,
  DevicePhoneMobileIcon,
  SparklesIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  CloudArrowUpIcon,
  CursorArrowRaysIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline'

export default function LandingPage() {
  const navigate = useNavigate()
  const { loadFromFiles } = usePdf()

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
    }
  }

  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-slate-900 via-primary-700 to-blue-900 dark:from-white dark:via-primary-400 dark:to-blue-400 bg-clip-text text-transparent leading-tight mb-6">
                Edit PDFs Like Magic
              </h1>
              <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 mb-4 max-w-3xl mx-auto">
                Advanced PDF editing features you won't find anywhere else. Edit text directly, rearrange pages, and customize - all in your browser.
              </p>
              <p className="text-lg text-primary-600 dark:text-primary-400 font-semibold mb-8">
                🎉 Free Forever • Powered by Ads • Always Available at Zero Cost
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="#upload" 
                  className="group px-10 py-5 rounded-xl bg-gradient-to-r from-primary-600 to-emerald-600 text-white font-bold text-xl shadow-xl shadow-primary-200 dark:shadow-primary-900/50 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Upload & Edit PDF Now
                  <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                No registration required • Start editing in seconds
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">100%</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Free Forever</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">No</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Registration</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">∞</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Unlimited Use</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section id="upload" className="max-w-5xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center mb-4">Upload Your PDF & Start Editing</h2>
          <p className="text-center text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Experience advanced PDF editing powered by professional-grade technology. Completely free, supported by ads to keep it available for everyone.
          </p>
          <UploadDropzone onFilesSelected={handleFilesSelected} />
        </motion.div>
      </section>

      {/* Why Choose Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Why Choose Bright Linx?</h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Advanced features powered by professional PDF technology, completely free and ad-supported
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<GiftIcon className="w-8 h-8" />}
            title="100% Free Forever"
            description="No hidden costs, no subscriptions. Supported by ads to keep it free for everyone, always."
            gradient="from-emerald-500 to-teal-500"
          />
          <FeatureCard
            icon={<CursorArrowRaysIcon className="w-8 h-8" />}
            title="Direct Text Editing"
            description="Advanced feature: Double-click to edit PDF text like a word processor. Rare capability most tools don't offer."
            gradient="from-blue-500 to-cyan-500"
          />
          <FeatureCard
            icon={<LockClosedIcon className="w-8 h-8" />}
            title="Privacy First"
            description="All editing happens in your browser - we never see your files. Your data stays 100% private and secure."
            gradient="from-purple-500 to-pink-500"
          />
          <FeatureCard
            icon={<ShieldCheckIcon className="w-8 h-8" />}
            title="No Registration"
            description="Start editing immediately without creating an account. No email, no signup, just upload and edit."
            gradient="from-orange-500 to-red-500"
          />
          <FeatureCard
            icon={<BoltIcon className="w-8 h-8" />}
            title="Lightning Fast"
            description="Professional-grade PDF engine for instant loading and real-time editing. No lag, ever."
            gradient="from-yellow-500 to-amber-500"
          />
          <FeatureCard
            icon={<DevicePhoneMobileIcon className="w-8 h-8" />}
            title="Works Everywhere"
            description="Desktop, tablet, and mobile browsers. Edit PDFs anywhere, anytime, on any device."
            gradient="from-indigo-500 to-purple-500"
          />
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900/50 dark:to-blue-900/10 rounded-3xl my-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Advanced Features Not Found Elsewhere</h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Powered by professional PDF technology, these advanced capabilities set us apart from basic online editors
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PowerFeature
            icon={<PencilSquareIcon className="w-10 h-10" />}
            title="Character-Level Text Editing"
            description="Industry-leading feature: Edit PDF text character-by-character like a notepad. Most online editors only let you add annotations - we let you actually edit the text itself."
            features={['Double-click any text to edit', 'Backspace to delete characters', 'Type directly into PDFs', 'Real-time preview of changes']}
          />
          <PowerFeature
            icon={<ArrowPathIcon className="w-10 h-10" />}
            title="Visual Page Reordering"
            description="Professional drag-and-drop page management with live thumbnails. Rearrange your entire document structure effortlessly."
            features={['Collapsible sidebar view', 'Drag pages to reorder', 'Visual thumbnail preview', 'Click to navigate pages']}
          />
          <PowerFeature
            icon={<SparklesIcon className="w-10 h-10" />}
            title="Advanced Text Formatting"
            description="Professional-grade text customization controls rarely found in free online tools. Take full control of your document's appearance."
            features={['Change text colors', 'Adjust font sizes', 'Multiple editing modes', 'Layer-based editing']}
          />
          <PowerFeature
            icon={<CloudArrowUpIcon className="w-10 h-10" />}
            title="Professional Export Quality"
            description="Download your edited PDF with all changes perfectly preserved using enterprise-grade PDF processing technology."
            features={['High-fidelity output', 'All edits preserved', 'Professional quality', 'Instant download']}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center p-8 bg-white dark:bg-slate-800 rounded-2xl border border-primary-200 dark:border-primary-700"
        >
          <p className="text-lg text-slate-700 dark:text-slate-300">
            <span className="font-bold text-primary-600 dark:text-primary-400">Why is this free? </span>
            We're supported by ads to keep these advanced features available to everyone at zero cost. No tricks, no limits - just powerful tools for free, forever.
          </p>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Edit a PDF in 4 Simple Steps</h2>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            From upload to download in under a minute
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StepCard
            number="1"
            title="Upload"
            description="Drag and drop your PDF file or click to select from your device"
          />
          <StepCard
            number="2"
            title="Edit"
            description="Click 'Text' mode and double-click any text to start editing directly"
          />
          <StepCard
            number="3"
            title="Customize"
            description="Change colors, sizes, and rearrange pages with drag-and-drop"
          />
          <StepCard
            number="4"
            title="Download"
            description="Click 'Export' to download your edited PDF with all changes saved"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary-600 to-emerald-600 rounded-3xl p-12 text-center text-white shadow-2xl"
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Edit Your PDFs?</h2>
          <p className="text-xl mb-2 opacity-90">
            Join thousands using advanced PDF editing features - completely free!
          </p>
          <p className="text-lg mb-8 opacity-75">
            Ad-supported to keep it free forever. No software installation required.
          </p>
          <a 
            href="#upload" 
            className="inline-block px-10 py-4 bg-white text-primary-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Upload & Start Editing Now - It's Free!
          </a>
        </motion.div>
      </section>

      {/* Coming Soon Link */}
      <section className="max-w-5xl mx-auto px-6 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Want to see what other tools we're building?
          </p>
          <Link 
            to="/coming-soon" 
            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition"
          >
            View upcoming features
            <span>→</span>
          </Link>
        </motion.div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description, gradient }: { icon: React.ReactNode, title: string, description: string, gradient: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="relative group"
    >
      <div className="h-full p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl transition-all duration-300">
        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} text-white mb-4`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-slate-300">{description}</p>
      </div>
    </motion.div>
  )
}

function PowerFeature({ icon, title, description, features }: { icon: React.ReactNode, title: string, description: string, features: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-8 rounded-2xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-primary-500 to-emerald-500 text-white">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-slate-600 dark:text-slate-300 mb-4">{description}</p>
          <ul className="space-y-2">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-400">
                <CheckCircleIcon className="w-5 h-5 text-primary-500 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

function StepCard({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: parseInt(number) * 0.1 }}
      className="relative p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-emerald-500 text-white flex items-center justify-center font-bold text-xl shadow-lg">
        {number}
      </div>
      <h3 className="text-lg font-bold mb-2 mt-4">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>
    </motion.div>
  )
}
