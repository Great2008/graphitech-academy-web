import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api } from './lib/api'

function Home() {
  const [apiStatus, setApiStatus] = useState('checking...')

  useEffect(() => {
    api
      .get('/health')
      .then(() => setApiStatus('online'))
      .catch(() => setApiStatus('offline'))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-sky-50 flex flex-col items-center justify-center px-6 text-center">
      <p className="text-xs tracking-[0.3em] text-brand-purple font-bold uppercase mb-2">
        GraphiTech Academy
      </p>
      <p className="text-xs text-slate-500 tracking-widest mb-8">
        Learn &middot; Build &middot; Earn &middot; Give Back
      </p>
      <h1 className="text-3xl font-extrabold text-brand-violet mb-4">
        Free coding courses. Real certificates.
      </h1>
      <p className="text-slate-600 max-w-md mb-8">
        Learn web development, Python, and AI productivity — free. Pay only
        when you earn a certificate.
      </p>
      <Link
        to="/courses"
        className="bg-brand-purple text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:opacity-90 transition"
      >
        Browse Courses
      </Link>
      <p className="text-xs text-slate-400 mt-10">
        Backend status: {apiStatus}
      </p>
    </div>
  )
}

function Courses() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      <p className="text-slate-500">Course list coming next.</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
      </Routes>
    </BrowserRouter>
  )
}
