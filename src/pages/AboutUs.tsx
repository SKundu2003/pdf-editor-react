import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { UserGroupIcon, SparklesIcon, ShieldCheckIcon, RocketLaunchIcon } from '@heroicons/react/24/outline'

export default function AboutUs() {
  useEffect(() => {
    document.title = 'About Us - Bright Linx Allied Ventures | Free PDF Tools'
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn about Brightlinx Allied Ventures. We provide free, fast, and easy-to-use online PDF tools with no registration required. Founded in 2025 to make PDF management effortless.')
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
            About Bright Linx
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Making PDF management effortless, secure, and accessible for everyone, everywhere
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-12 mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
              <strong>Brightlinx.in</strong> is a project of <strong>Bright Linx Allied Ventures</strong>, founded in 2025. 
              We provide free, fast, and easy-to-use online PDF tools designed to simplify your document management tasks.
            </p>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
              Whether you need to merge, split, compress, convert, or edit PDFs, Brightlinx offers a secure and reliable 
              platform to get it done — directly from your browser, with <strong>no installation required</strong>, 
              <strong> no account creation needed</strong>, and <strong>no documents stored on our servers</strong>.
            </p>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              At Brightlinx, our mission is to make working with PDFs effortless, secure, and accessible for everyone, everywhere.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <ValueCard
            icon={<SparklesIcon className="w-8 h-8" />}
            title="Innovation"
            description="Cutting-edge PDF technology accessible to everyone"
            gradient="from-yellow-500 to-amber-500"
          />
          <ValueCard
            icon={<ShieldCheckIcon className="w-8 h-8" />}
            title="Security"
            description="Your files never leave your browser. 100% private."
            gradient="from-emerald-500 to-teal-500"
          />
          <ValueCard
            icon={<RocketLaunchIcon className="w-8 h-8" />}
            title="Speed"
            description="Lightning-fast processing with instant results"
            gradient="from-blue-500 to-cyan-500"
          />
          <ValueCard
            icon={<UserGroupIcon className="w-8 h-8" />}
            title="Accessibility"
            description="Free forever, powered by ads for everyone"
            gradient="from-purple-500 to-pink-500"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900/50 dark:to-blue-900/10 rounded-3xl p-12 mb-12"
        >
          <h2 className="text-4xl font-bold mb-8 text-center">Meet The Team</h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 text-center mb-12 max-w-3xl mx-auto">
            Brightlinx.in is powered by a small, agile, and passionate team of professionals dedicated to developing 
            innovative online PDF solutions that simplify digital document management for everyone.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <TeamMember
              name="Mr. Samrat Kundu"
              role="Visionary & Concept Creator"
              description="The creative mind behind Brightlinx, whose vision and foresight laid the foundation for the platform."
              gradient="from-primary-500 to-emerald-500"
            />
            <TeamMember
              name="Mr. Srijeet Mondal"
              role="Strategic & Technical Lead"
              description="Contributed strategic and technical expertise to enhance functionality and user experience."
              gradient="from-blue-500 to-cyan-500"
            />
            <TeamMember
              name="Mr. Souvik Kundu"
              role="Design & Implementation"
              description="Transformed the vision into reality through exceptional design sense and technical implementation."
              gradient="from-purple-500 to-pink-500"
            />
          </div>

          <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed text-center">
            Together, this talented trio combined <strong>imagination</strong>, <strong>coordination</strong>, 
            and <strong>innovation</strong> to create a platform that stands for simplicity, speed, and security in PDF management.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Our Commitment</h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            <CommitmentItem
              number="1"
              title="Free Forever"
              description="Every tool offered by Brightlinx.in is built to make handling PDFs faster, safer, and easier — completely free, supported by ads."
            />
            <CommitmentItem
              number="2"
              title="Privacy First"
              description="No documents are stored on our servers. All processing happens locally in your browser for maximum security."
            />
            <CommitmentItem
              number="3"
              title="Continuous Innovation"
              description="With ongoing innovation, hard work, and commitment, we continue to expand Brightlinx into a trusted global platform."
            />
            <CommitmentItem
              number="4"
              title="Global Reach"
              description="Serving thousands of users every day, helping them solve their PDF challenges quickly, securely, and for free."
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function ValueCard({ icon, title, description, gradient }: { icon: React.ReactNode, title: string, description: string, gradient: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
    </motion.div>
  )
}

function TeamMember({ name, role, description, gradient }: { name: string, role: string, description: string, gradient: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${gradient} mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold`}>
        {name.split(' ')[1][0]}
      </div>
      <h3 className="text-xl font-bold text-center mb-2">{name}</h3>
      <p className={`text-sm font-semibold text-center mb-3 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
        {role}
      </p>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">{description}</p>
    </motion.div>
  )
}

function CommitmentItem({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-emerald-500 text-white flex items-center justify-center font-bold text-lg">
        {number}
      </div>
      <div>
        <h3 className="text-lg font-bold mb-1">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400">{description}</p>
      </div>
    </div>
  )
}
