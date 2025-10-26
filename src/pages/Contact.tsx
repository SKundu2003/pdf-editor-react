import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    document.title = 'Contact Us - Bright Linx Allied Ventures'
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get in touch with Bright Linx Allied Ventures. Contact us for support, feedback, or business inquiries. We are here to help you with all your PDF needs.')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const emailData = {
      to: 'support@brightlinx.in',
      from: formData.email,
      subject: `[${formData.subject}] ${formData.name}`,
      message: formData.message,
      timestamp: new Date().toISOString()
    }
    
    console.log('Contact form submission:', emailData)
    
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

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
            info="support@brightlinx.in"
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8"
          >
            <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
            
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl p-8 text-center"
              >
                <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                <p>Your message has been received. We'll get back to you soon!</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  >
                    <option value="">Select a subject</option>
                    <option value="support">Technical Support</option>
                    <option value="feedback">Feedback & Suggestions</option>
                    <option value="business">Business Inquiry</option>
                    <option value="bug">Report a Bug</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-emerald-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Send Message
                </button>
              </form>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-8"
          >
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900/50 dark:to-blue-900/10 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
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
                  answer="Absolutely! We love hearing feature requests. Please use the 'Feedback & Suggestions' subject when contacting us."
                />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Business Inquiries</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Interested in partnerships, advertising opportunities, or enterprise solutions?
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Email us at: <a href="mailto:business@brightlinx.in" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">business@brightlinx.in</a>
              </p>
            </div>
          </motion.div>
        </div>
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
    <div>
      <h4 className="font-semibold mb-1 text-slate-900 dark:text-white">{question}</h4>
      <p className="text-sm text-slate-600 dark:text-slate-400">{answer}</p>
    </div>
  )
}
