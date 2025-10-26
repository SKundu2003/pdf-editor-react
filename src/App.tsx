import { Route, Routes, Link, useLocation } from 'react-router-dom'
import LandingPage from '@/pages/LandingPage'
import EditorPage from '@/pages/EditorPage'
import ComingSoon from '@/pages/ComingSoon'
import AboutUs from '@/pages/AboutUs'
import Contact from '@/pages/Contact'
import TermsOfUse from '@/pages/TermsOfUse'
import PrivacyPolicy from '@/pages/PrivacyPolicy'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { PdfProvider } from './context/PdfContext'

export default function App() {
  const location = useLocation()
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100">
      <Header />
      <main className="flex-1">
        <PdfProvider>
          <Routes location={location}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="*" element={<div className="p-8 text-center">Not Found. <Link to="/" className="text-primary-500 underline">Go home</Link></div>} />
          </Routes>
        </PdfProvider>
      </main>
      <Footer />
    </div>
  )
}
