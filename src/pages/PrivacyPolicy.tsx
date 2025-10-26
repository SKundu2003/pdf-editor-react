import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheckIcon, EyeSlashIcon, ServerIcon, LockClosedIcon } from '@heroicons/react/24/outline'

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Privacy Policy - Bright Linx Allied Ventures'
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Privacy Policy for Brightlinx.in. Learn how we protect your privacy. Your files never leave your browser - 100% client-side processing with no data storage.')
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-slate-900 via-primary-700 to-blue-900 dark:from-white dark:via-primary-400 dark:to-blue-400 bg-clip-text text-transparent mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Last Updated: October 26, 2025
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <PrivacyFeature
            icon={<ShieldCheckIcon className="w-6 h-6" />}
            title="No File Storage"
            gradient="from-emerald-500 to-teal-500"
          />
          <PrivacyFeature
            icon={<EyeSlashIcon className="w-6 h-6" />}
            title="No Tracking"
            gradient="from-blue-500 to-cyan-500"
          />
          <PrivacyFeature
            icon={<ServerIcon className="w-6 h-6" />}
            title="Client-Side Only"
            gradient="from-purple-500 to-pink-500"
          />
          <PrivacyFeature
            icon={<LockClosedIcon className="w-6 h-6" />}
            title="100% Secure"
            gradient="from-orange-500 to-red-500"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 md:p-12 space-y-8"
        >
          <Section title="Our Privacy Commitment">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-700">
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                At Brightlinx.in, your privacy is our top priority. We have designed our service to ensure that your documents and personal information remain completely private and secure.
              </p>
            </div>
          </Section>

          <Section title="1. Information We Do NOT Collect">
            <p>
              <strong>We want to be crystal clear:</strong>
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li><strong>Your PDF files:</strong> All PDF processing happens in your browser. Your files never leave your device and are never uploaded to our servers.</li>
              <li><strong>Document content:</strong> We cannot see, access, or store any content from your documents.</li>
              <li><strong>Personal identification:</strong> We do not require registration, so we don't collect names, emails, or passwords.</li>
              <li><strong>File metadata:</strong> We don't track what files you process or when you use our service.</li>
            </ul>
          </Section>

          <Section title="2. Information We Do Collect">
            <p>
              To maintain and improve our service, we collect minimal, anonymous data:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li><strong>Analytics Data:</strong> We use privacy-friendly analytics to understand website traffic, such as page views and general usage patterns. This data is completely anonymous and cannot be traced back to you.</li>
              <li><strong>Technical Information:</strong> Basic technical data like browser type, device type, and operating system to optimize our service for all users.</li>
              <li><strong>Cookies:</strong> We use minimal cookies for essential functionality and anonymous analytics. You can manage cookie preferences through your browser settings.</li>
            </ul>
          </Section>

          <Section title="3. How Your Files Are Processed">
            <p className="font-semibold">
              Client-Side Processing (In Your Browser):
            </p>
            <ol className="list-decimal pl-6 mt-2 space-y-2">
              <li>You upload a PDF file through our interface</li>
              <li>The file is processed entirely in your browser using JavaScript</li>
              <li>All editing, converting, or merging happens on your device</li>
              <li>When you download the result, it's saved directly from your browser</li>
              <li>Your original file and the processed file remain only on your device</li>
            </ol>
            <p className="mt-4 text-sm italic">
              Think of Brightlinx.in as a tool that runs on your computer, not on our servers. We simply provide the code that runs in your browser.
            </p>
          </Section>

          <Section title="4. Third-Party Services & Advertising">
            <p>
              <strong>Google AdSense & Advertising Partners:</strong> Brightlinx.in is supported by Google AdSense and other third-party advertising partners to keep our service completely free. Here's what you need to know:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li><strong>Ad Serving:</strong> We use Google AdSense to display advertisements on our website</li>
              <li><strong>Cookies & Tracking:</strong> Third-party advertising partners may use cookies and similar technologies to serve personalized ads based on your interests</li>
              <li><strong>Your Documents Are Safe:</strong> We do not share any of your PDF files or document data with advertisers. Ad networks only collect standard web analytics</li>
              <li><strong>Google Privacy Policy:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">View Google's Privacy Policy</a></li>
              <li><strong>Manage Ad Preferences:</strong> You can control ad personalization via <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Google Ad Settings</a></li>
            </ul>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                Important: Advertisements help us keep Brightlinx free forever. By using our service, you consent to the use of cookies by Google AdSense and our advertising partners as described in this policy.
              </p>
            </div>
            <p className="mt-4">
              <strong>Content Delivery Networks (CDN):</strong> We use CDNs to deliver JavaScript libraries and fonts. These are industry-standard services that do not access your documents.
            </p>
          </Section>

          <Section title="5. Data Security">
            <p>
              We implement multiple layers of security:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li><strong>HTTPS Encryption:</strong> All connections to Brightlinx.in are encrypted using SSL/TLS</li>
              <li><strong>No Server Storage:</strong> Since we don't receive your files, there's no risk of server breaches</li>
              <li><strong>Client-Side Only:</strong> Processing happens entirely in your browser's sandboxed environment</li>
              <li><strong>No User Accounts:</strong> No passwords means no password breaches</li>
            </ul>
          </Section>

          <Section title="6. Your Rights and Choices">
            <p>
              You have full control over your privacy:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li><strong>Cookie Management:</strong> You can control cookies through your browser settings</li>
              <li><strong>Opt-Out of Analytics:</strong> You can disable analytics cookies through your browser settings at any time</li>
              <li><strong>Ad Settings:</strong> Manage personalized ads through <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Google Ad Settings</a></li>
              <li><strong>Do Not Track:</strong> We respect browser "Do Not Track" signals</li>
            </ul>
          </Section>

          <Section title="7. Children's Privacy">
            <p>
              Brightlinx.in does not knowingly collect or target children under the age of 13. Our service is designed for general audiences. If you are a parent or guardian and believe your child has used our service, please contact us.
            </p>
          </Section>

          <Section title="8. International Users">
            <p>
              Brightlinx.in is operated from India. Since all processing happens in your browser, your data stays on your device regardless of your location. We comply with applicable data protection laws including GDPR for European users.
            </p>
          </Section>

          <Section title="9. Changes to This Privacy Policy">
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify users of significant changes by:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Updating the "Last Updated" date at the top of this page</li>
              <li>Displaying a notice on our homepage for major changes</li>
            </ul>
            <p className="mt-2">
              Your continued use of Brightlinx.in after changes indicates acceptance of the updated policy.
            </p>
          </Section>

          <Section title="10. Contact Us">
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at <a href="mailto:brightlinx.allied@gmail.com" className="text-primary-600 dark:text-primary-400 hover:underline font-semibold">brightlinx.allied@gmail.com</a>
            </p>
          </Section>

          <div className="mt-12 p-6 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-2xl border border-primary-200 dark:border-primary-700">
            <h3 className="font-bold text-lg mb-2">Summary: What Makes Us Different</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Unlike many online PDF tools, we don't upload your files to servers. Everything happens in your browser. 
              This means we literally cannot access your documents, making Brightlinx.in one of the most private PDF tools available. 
              Your privacy isn't just a policy—it's built into our technology.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{title}</h2>
      <div className="space-y-4 text-slate-700 dark:text-slate-300">
        {children}
      </div>
    </div>
  )
}

function PrivacyFeature({ icon, title, gradient }: { icon: React.ReactNode, title: string, gradient: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg text-center"
    >
      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${gradient} text-white mb-2`}>
        {icon}
      </div>
      <p className="text-sm font-semibold">{title}</p>
    </motion.div>
  )
}
