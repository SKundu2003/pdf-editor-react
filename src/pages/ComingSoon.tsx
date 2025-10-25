import { motion } from 'framer-motion'

export default function ComingSoon() {
  const upcomingFeatures = [
    {
      icon: '🔄',
      title: 'PDF to Word Converter',
      description: 'Convert your PDF documents to editable Word files instantly',
      status: 'Coming Soon'
    },
    {
      icon: '📊',
      title: 'PDF to Excel',
      description: 'Extract tables and data from PDFs into Excel spreadsheets',
      status: 'Coming Soon'
    },
    {
      icon: '🖼️',
      title: 'PDF to Image',
      description: 'Convert PDF pages to JPG, PNG, or other image formats',
      status: 'Coming Soon'
    },
    {
      icon: '🗜️',
      title: 'Advanced Compression',
      description: 'Reduce PDF file size without losing quality',
      status: 'Coming Soon'
    },
    {
      icon: '✍️',
      title: 'Digital Signatures',
      description: 'Sign PDF documents electronically with ease',
      status: 'Coming Soon'
    },
    {
      icon: '🔒',
      title: 'Password Protection',
      description: 'Secure your PDFs with encryption and passwords',
      status: 'Coming Soon'
    },
    {
      icon: '📝',
      title: 'Fill PDF Forms',
      description: 'Complete and save fillable PDF forms online',
      status: 'Coming Soon'
    },
    {
      icon: '🎨',
      title: 'Add Watermarks',
      description: 'Add custom watermarks to protect your documents',
      status: 'Coming Soon'
    },
    {
      icon: '📄',
      title: 'Merge PDFs',
      description: 'Combine multiple PDF files into one document',
      status: 'In Development'
    },
    {
      icon: '✂️',
      title: 'Split PDF',
      description: 'Extract specific pages or split PDF into multiple files',
      status: 'Coming Soon'
    },
    {
      icon: '🔍',
      title: 'OCR Text Recognition',
      description: 'Convert scanned PDFs to searchable text',
      status: 'Coming Soon'
    },
    {
      icon: '📱',
      title: 'Mobile Apps',
      description: 'Edit PDFs on the go with our iOS and Android apps',
      status: 'Coming Soon'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
      <section className="max-w-7xl mx-auto px-6 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Exciting Features Coming Soon! 🚀
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            We're constantly working to bring you the most powerful PDF tools. Here's what's in our pipeline.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-3">
                {feature.description}
              </p>
              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                feature.status === 'In Development' 
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
              }`}>
                {feature.status}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-3">Want to be notified?</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Stay updated on new features and improvements. We'll never spam you!
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium">
                Notify Me
              </button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
