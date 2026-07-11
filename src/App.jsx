import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import { api } from './lib/api'
import { AuthProvider } from './lib/AuthContext'
import { EditorWindow } from './components/EditorWindow'
import { MenuOverlay } from './components/MenuOverlay'
import { DragHintBanner } from './components/DragHintBanner'
import { useDragDownToOpen } from './hooks/useDragDownToOpen'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CourseList from './pages/CourseList'
import CourseDetail from './pages/CourseDetail'
import Tutor from './pages/Tutor'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminStudents from './pages/admin/AdminStudents'
import AdminStudentDetail from './pages/admin/AdminStudentDetail'
import AdminCourses from './pages/admin/AdminCourses'
import AdminCourseDetail from './pages/admin/AdminCourseDetail'
import AdminAIDraft from './pages/admin/AdminAIDraft'

function TopBar() {
  return (
    <nav className="border-b border-white/5 bg-ink/95 backdrop-blur sticky top-0 z-10">
      <div className="px-6 py-4 max-w-2xl mx-auto">
        <Link to="/" className="font-display text-sm font-bold text-white tracking-tight">
          GraphiTech<span className="text-brand-purple">Academy</span>
        </Link>
      </div>
    </nav>
  )
}

function Home() {
  const [apiStatus, setApiStatus] = useState('checking')

  useEffect(() => {
    api
      .get('/health')
      .then(() => setApiStatus('online'))
      .catch(() => setApiStatus('offline'))
  }, [])

  const statusColor =
    apiStatus === 'online' ? 'text-brand-green' : apiStatus === 'offline' ? 'text-brand-red' : 'text-white/40'

  return (
    <div className="min-h-[calc(100vh-73px-42px)] flex items-center justify-center px-6 py-12">
      <EditorWindow label="academy.sh" className="w-full max-w-md">
        <p className="font-mono text-xs text-brand-green mb-6">$ whoami</p>
        <h1 className="font-display font-extrabold text-3xl leading-tight text-white mb-4">
          Free coding courses.
          <br />
          <span className="text-brand-purple">Certificates that verify.</span>
        </h1>
        <p className="text-white/60 mb-8 leading-relaxed">
          Learn web development, Python, and AI productivity — free. Pay
          only when you've earned a certificate.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            to="/courses"
            className="text-center bg-brand-purple text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-brand-purple/20 hover:opacity-90 transition"
          >
            Browse Courses
          </Link>
          <Link
            to="/tutor"
            className="text-center border border-white/10 text-white/80 px-6 py-3 rounded-full font-semibold hover:bg-white/5 transition"
          >
            Try the AI Tutor
          </Link>
        </div>
        <p className={`font-mono text-xs mt-8 ${statusColor}`}>
          &gt; backend: {apiStatus}
        </p>
      </EditorWindow>
    </div>
  )
}

function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const openMenu = useCallback(() => setMenuOpen(true), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useDragDownToOpen(openMenu, !menuOpen)

  return (
    <>
      <TopBar />
      <MenuOverlay isOpen={menuOpen} onClose={closeMenu} />
      <div className="pb-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:slug" element={<CourseDetail />} />
          <Route path="/tutor" element={<Tutor />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/students/:id" element={<AdminStudentDetail />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/courses/:id" element={<AdminCourseDetail />} />
          <Route path="/admin/ai-draft" element={<AdminAIDraft />} />
        </Routes>
      </div>
      <DragHintBanner onOpen={openMenu} />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  )
}
