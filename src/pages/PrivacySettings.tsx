import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

export default function PrivacySettings() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true)
  const [adPersonalizationEnabled, setAdPersonalizationEnabled] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    document.title = 'Privacy Settings - Bright Linx Allied Ventures'
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Manage your privacy preferences for Brightlinx.in. Control cookies, analytics, and ad personalization settings.')
    }

    const storedAnalytics = localStorage.getItem('analyticsEnabled')
    const storedAdPersonalization = localStorage.getItem('adPersonalizationEnabled')
    
    if (storedAnalytics !== null) setAnalyticsEnabled(storedAnalytics === 'true')
    if (storedAdPersonalization !== null) setAdPersonalizationEnabled(storedAdPersonalization === 'true')
  }, [])

  const handleSave = () => {
    localStorage.setItem('analyticsEnabled', analyticsEnabled.toString())
    localStorage.setItem('adPersonalizationEnabled', adPersonalizationEnabled.toString())
    
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)

    if (analyticsEnabled) {
      console.log('Analytics enabled')
    } else {
      console.log('Analytics disabled')
    }
  }

  const handleAcceptAll = () => {
    setAnalyticsEnabled(true)
    setAdPersonalizationEnabled(true)
  }

  const handleRejectAll = () => {
    setAnalyticsEnabled(false)
    setAdPersonalizationEnabled(false)
  }

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
            Privacy Settings
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Control your privacy preferences and manage how we collect data
          </p>
        </motion.div>

        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl text-center"
          >
            <p className="text-emerald-700 dark:text-emerald-300 font-semibold">
              ✓ Your privacy settings have been saved successfully!
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 md:p-12 space-y-8"
        >
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
            <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Important Note</h2>
            <p className="text-slate-700 dark:text-slate-300">
              <strong>Your PDF files are never sent to our servers.</strong> All processing happens in your browser. 
              These settings only control analytics and advertising preferences, not your document processing.
            </p>
          </div>

          <div className="space-y-6">
            <SettingCard
              title="Essential Cookies"
              description="Required for the website to function properly. These cannot be disabled."
              enabled={true}
              locked={true}
              onChange={() => {}}
              icon={<CheckCircleIcon className="w-6 h-6 text-emerald-500" />}
            />

            <SettingCard
              title="Analytics Cookies"
              description="Help us understand how visitors use our website so we can improve it. These are completely anonymous and do not track your documents."
              enabled={analyticsEnabled}
              locked={false}
              onChange={setAnalyticsEnabled}
              details={[
                'Page views and navigation patterns',
                'Browser type and device information',
                'General usage statistics',
                'No personal identification'
              ]}
            />

            <SettingCard
              title="Advertising & Personalization"
              description="Allow our advertising partners to show more relevant ads based on your interests. This helps keep our service free."
              enabled={adPersonalizationEnabled}
              locked={false}
              onChange={setAdPersonalizationEnabled}
              details={[
                'Personalized ad content',
                'Ad performance measurement',
                'Does not access your documents',
                'Managed by third-party providers'
              ]}
            />
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={handleAcceptAll}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-emerald-600 text-white font-semibold hover:shadow-lg transition-all duration-300"
              >
                Accept All
              </button>
              <button
                onClick={handleSave}
                className="px-8 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold hover:shadow-lg transition-all duration-300"
              >
                Save Preferences
              </button>
              <button
                onClick={handleRejectAll}
                className="px-8 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300"
              >
                Reject All Optional
              </button>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-bold">Additional Privacy Options</h3>
            
            <div className="space-y-3">
              <PrivacyLink
                title="Clear Browser Data"
                description="Remove all cookies and site data from your browser"
                action="Browser Settings"
              />
              <PrivacyLink
                title="Do Not Track"
                description="Enable Do Not Track in your browser settings"
                action="Browser Settings"
              />
              <PrivacyLink
                title="Google Ad Settings"
                description="Manage personalized ads across Google services"
                action="Visit Google"
                link="https://adssettings.google.com"
              />
              <PrivacyLink
                title="Read Our Privacy Policy"
                description="Full details on how we protect your privacy"
                action="View Policy"
                link="/privacy-policy"
              />
            </div>
          </div>

          <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
            <h3 className="font-bold mb-2">Your Rights</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              You have the right to access, correct, or delete any personal data we may have. 
              Since we don't collect or store your documents, there's no document data to delete. 
              For any privacy-related questions, contact us at <a href="mailto:privacy@brightlinx.in" className="text-primary-600 dark:text-primary-400 hover:underline">privacy@brightlinx.in</a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function SettingCard({ 
  title, 
  description, 
  enabled, 
  locked, 
  onChange, 
  icon,
  details 
}: { 
  title: string
  description: string
  enabled: boolean
  locked: boolean
  onChange: (value: boolean) => void
  icon?: React.ReactNode
  details?: string[]
}) {
  return (
    <div className="p-6 border border-slate-200 dark:border-slate-700 rounded-2xl hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
            {title}
            {locked && icon}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
        </div>
        <div className="ml-4">
          {locked ? (
            <div className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm font-medium">
              Always On
            </div>
          ) : (
            <button
              onClick={() => onChange(!enabled)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                enabled 
                  ? 'bg-gradient-to-r from-primary-500 to-emerald-500' 
                  : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  enabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          )}
        </div>
      </div>
      
      {details && enabled && !locked && (
        <ul className="mt-3 space-y-1 text-sm text-slate-600 dark:text-slate-400">
          {details.map((detail, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-primary-500 flex-shrink-0" />
              {detail}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function PrivacyLink({ 
  title, 
  description, 
  action, 
  link 
}: { 
  title: string
  description: string
  action: string
  link?: string
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
      <div>
        <h4 className="font-semibold mb-1">{title}</h4>
        <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
      </div>
      {link ? (
        <a
          href={link}
          target={link.startsWith('http') ? '_blank' : undefined}
          rel={link.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
        >
          {action} →
        </a>
      ) : (
        <span className="px-4 py-2 text-sm font-medium text-slate-500">{action}</span>
      )}
    </div>
  )
}
