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
  CloudArrowUpIcon
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
              <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
                The most powerful free online PDF editor. Edit text, rearrange pages, and export - all in your browser with zero compromise.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="#upload" 
                  className="group px-8 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-emerald-600 text-white font-semibold text-lg shadow-xl shadow-primary-200 dark:shadow-primary-900/50 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Start Editing Free
                  <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </a>
                <Link 
                  to="/coming-soon" 
                  className="px-8 py-4 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-lg border-2 border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg transition-all duration-300"
                >
                  View All Tools
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">100%</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Free Forever</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">Zero</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Watermarks</div>
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
          <h2 className="text-3xl font-bold text-center mb-8">Upload Your PDF & Start Editing</h2>
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
            Experience the most advanced PDF editing tools, completely free with no compromises
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<GiftIcon className="w-8 h-8" />}
            title="100% Free"
            description="No hidden costs, no subscription fees, unlimited usage. Everything you need, completely free forever."
            gradient="from-emerald-500 to-teal-500"
          />
          <FeatureCard
            icon={<CheckCircleIcon className="w-8 h-8" />}
            title="No Watermarks"
            description="Your documents stay clean and professional. Export PDFs without any watermarks or branding."
            gradient="from-blue-500 to-cyan-500"
          />
          <FeatureCard
            icon={<LockClosedIcon className="w-8 h-8" />}
            title="Privacy First"
            description="All editing happens in your browser - we never see your files. Your data stays 100% private."
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
            description="Built with cutting-edge technology for instant loading and real-time editing. No lag, ever."
            gradient="from-yellow-500 to-amber-500"
          />
          <FeatureCard
            icon={<DevicePhoneMobileIcon className="w-8 h-8" />}
            title="All Devices"
            description="Works perfectly on desktop, tablet, and mobile browsers. Edit PDFs anywhere, anytime."
            gradient="from-indigo-500 to-purple-500"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900/50 dark:to-blue-900/10 rounded-3xl my-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Powerful Editing Features</h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Everything you need to edit PDFs like a pro, right in your browser
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PowerFeature
            icon={<DocumentTextIcon className="w-10 h-10" />}
            title="Direct Text Editing"
            description="Double-click any text to edit it like a notepad. Change content, fix typos, and update documents in seconds."
            features={['Character-level editing', 'Font size control', 'Color customization', 'Real-time preview']}
          />
          <PowerFeature
            icon={<ArrowPathIcon className="w-10 h-10" />}
            title="Drag & Drop Pages"
            description="Rearrange PDF pages with smooth drag-and-drop. Reorder your document structure effortlessly."
            features={['Visual thumbnails', 'Instant reordering', 'Page navigation', 'Collapsible sidebar']}
          />
          <PowerFeature
            icon={<SparklesIcon className="w-10 h-10" />}
            title="Advanced Formatting"
            description="Take control of your PDF's appearance with professional formatting tools and customization options."
            features={['Text colors', 'Size adjustments', 'Style controls', 'Layer management']}
          />
          <PowerFeature
            icon={<CloudArrowUpIcon className="w-10 h-10" />}
            title="Export Perfection"
            description="Download your edited PDF with all changes preserved. Perfect quality, zero watermarks, every time."
            features={['High-quality output', 'All edits saved', 'No watermarks', 'Instant download']}
          />
        </div>
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
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users editing PDFs for free. No software installation required!
          </p>
          <a 
            href="#upload" 
            className="inline-block px-10 py-4 bg-white text-primary-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Start Editing Now - It's Free!
          </a>
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
