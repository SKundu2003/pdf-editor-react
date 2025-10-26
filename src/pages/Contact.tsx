import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline'

export default function Contact() {
  useEffect(() => {
    document.title = 'Contact Us - Bright Linx Allied Ventures'
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get in touch with Bright Linx Allied Ventures. Contact us for support, feedback, or business inquiries. We are here to help you with all your PDF needs.')
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-slate-900 via-primary-700 to-blue-900 dark:from-white dark:via-primary-400 dark:to-blue-400 bg-clip-text text-transparent mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Have questions, feedback, or need support? We'd love to hear from you!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <ContactCard
            icon={<EnvelopeIcon className="w-8 h-8" />}
            title="Email Us"
            info="brightlinx.allied@gmail.com"
            description="We'll respond within 24-48 hours"
            gradient="from-blue-500 to-cyan-500"
          />
          <ContactCard
            icon={<MapPinIcon className="w-8 h-8" />}
            title="Location"
            info="India"
            description="Serving users globally"
            gradient="from-emerald-500 to-teal-500"
          />
          <ContactCard
            icon={<PhoneIcon className="w-8 h-8" />}
            title="Business Hours"
            info="Mon - Fri: 9 AM - 6 PM IST"
            description="Email support available 24/7"
            gradient="from-purple-500 to-pink-500"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900/50 dark:to-blue-900/10 rounded-3xl p-10">
            <h3 className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions</h3>
            <div className="space-y-6">
              <FAQItem
                question="How long does it take to get a response?"
                answer="We typically respond to all inquiries within 24-48 hours during business days."
              />
              <FAQItem
                question="Is there phone support available?"
                answer="Currently, we provide support via email only. This allows us to keep our services free while maintaining quality support."
              />
              <FAQItem
                question="Can I request a new feature?"
                answer="Absolutely! We love hearing feature requests. Please email us at brightlinx.allied@gmail.com with your suggestions."
              />
              <FAQItem
                question="How do I report a bug or technical issue?"
                answer="Send us an email at brightlinx.allied@gmail.com with details about the issue you're experiencing, and we'll work to resolve it quickly."
              />
              <FAQItem
                question="Do you offer enterprise or business solutions?"
                answer="Yes! For partnerships, advertising opportunities, or enterprise solutions, please reach out to us at brightlinx.allied@gmail.com."
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function ContactCard({ icon, title, info, description, gradient }: { 
  icon: React.ReactNode, 
  title: string, 
  info: string, 
  description: string,
  gradient: string 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
    >
      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${gradient} text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-slate-900 dark:text-white font-semibold mb-1">{info}</p>
      <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
    </motion.div>
  )
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md">
      <h4 className="font-bold mb-2 text-lg text-slate-900 dark:text-white">{question}</h4>
      <p className="text-slate-600 dark:text-slate-400">{answer}</p>
    </div>
  )
}
