import { Route, Routes, Link, useLocation } from 'react-router-dom'
import LandingPage from '@/pages/LandingPage'
import EditorPage from '@/pages/EditorPage'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function App() {
  const location = useLocation()
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100">
      <Header />
      <main className="flex-1">
        <Routes location={location}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="*" element={<div className="p-8 text-center">Not Found. <Link to="/" className="text-primary-500 underline">Go home</Link></div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
