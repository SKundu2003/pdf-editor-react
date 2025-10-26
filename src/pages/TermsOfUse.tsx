import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function TermsOfUse() {
  useEffect(() => {
    document.title = 'Terms of Use - Bright Linx Allied Ventures'
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Terms of Use for Brightlinx.in PDF tools. Read our terms and conditions for using our free online PDF editor, converter, and other tools.')
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
            Terms of Use
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Last Updated: October 26, 2025
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 md:p-12 space-y-8"
        >
          <Section title="1. Acceptance of Terms">
            <p>
              By accessing and using Brightlinx.in (the "Service"), operated by Bright Linx Allied Ventures, you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our Service.
            </p>
          </Section>

          <Section title="2. Description of Service">
            <p>
              Brightlinx.in provides free online PDF tools including but not limited to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>PDF Editor - Direct text editing and modification</li>
              <li>PDF Converter - Convert PDFs to various formats</li>
              <li>PDF Merger - Combine multiple PDF files</li>
              <li>PDF Compressor - Reduce PDF file sizes</li>
              <li>Other PDF-related utilities</li>
            </ul>
            <p className="mt-4">
              All tools are provided free of charge and are supported by advertisements to keep the service available to everyone.
            </p>
          </Section>

          <Section title="3. User Obligations">
            <p>
              When using our Service, you agree to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Use the Service only for lawful purposes</li>
              <li>Not upload or process any illegal, harmful, or copyrighted content without authorization</li>
              <li>Not attempt to disrupt, damage, or interfere with the Service</li>
              <li>Not use automated tools or bots to access the Service excessively</li>
              <li>Not reverse engineer or attempt to extract source code from our Service</li>
            </ul>
          </Section>

          <Section title="4. Privacy and Data Processing">
            <p>
              <strong>Your privacy is our priority.</strong> All PDF processing happens directly in your browser using client-side technology. We do not upload, store, or have access to your files. For more details, please read our <a href="/privacy-policy" className="text-primary-600 dark:text-primary-400 hover:underline">Privacy Policy</a>.
            </p>
          </Section>

          <Section title="5. Intellectual Property">
            <p>
              All content, features, and functionality of Brightlinx.in, including but not limited to text, graphics, logos, and software, are the exclusive property of Bright Linx Allied Ventures and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
            <p className="mt-4">
              You retain all rights to the documents you process using our Service. We claim no ownership over your files.
            </p>
          </Section>

          <Section title="6. Disclaimer of Warranties">
            <p>
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, either express or implied, including but not limited to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Merchantability or fitness for a particular purpose</li>
              <li>Uninterrupted or error-free operation</li>
              <li>Accuracy or reliability of results</li>
              <li>That defects will be corrected</li>
            </ul>
          </Section>

          <Section title="7. Limitation of Liability">
            <p>
              To the fullest extent permitted by law, Bright Linx Allied Ventures shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Loss of data or documents</li>
              <li>Loss of profits or business opportunities</li>
              <li>Service interruptions or errors</li>
              <li>Any other damages arising from your use of the Service</li>
            </ul>
          </Section>

          <Section title="8. Third-Party Services and Advertisements">
            <p>
              Our Service is supported by advertisements and may contain links to third-party websites or services. We are not responsible for the content, privacy policies, or practices of any third-party sites. Your interactions with third-party advertisements are solely between you and the advertiser.
            </p>
          </Section>

          <Section title="9. Changes to Service">
            <p>
              We reserve the right to modify, suspend, or discontinue any part of the Service at any time without prior notice. We may also update these Terms of Use periodically. Continued use of the Service after changes constitutes acceptance of the revised terms.
            </p>
          </Section>

          <Section title="10. Termination">
            <p>
              We reserve the right to terminate or suspend your access to the Service immediately, without prior notice, for any reason, including but not limited to breach of these Terms of Use.
            </p>
          </Section>

          <Section title="11. Governing Law">
            <p>
              These Terms of Use shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts in India.
            </p>
          </Section>

          <Section title="12. Contact Information">
            <p>
              If you have any questions about these Terms of Use, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> <a href="mailto:legal@brightlinx.in" className="text-primary-600 dark:text-primary-400 hover:underline">legal@brightlinx.in</a>
            </p>
          </Section>

          <div className="mt-12 p-6 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-2xl border border-primary-200 dark:border-primary-700">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <strong>Note:</strong> By using Brightlinx.in, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use and our Privacy Policy.
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
