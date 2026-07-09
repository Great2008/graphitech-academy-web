import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api } from './lib/api'
import { AuthProvider, useAuth } from './lib/AuthContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CourseList from './pages/CourseList'
import CourseDetail from './pages/CourseDetail'
import Tutor from './pages/Tutor'
import AdminCourses from './pages/admin/AdminCourses'
import AdminCourseDetail from './pages/admin/AdminCourseDetail'
import AdminAIDraft from './pages/admin/AdminAIDraft'

const STAFF_ROLES = ['instructor', 'admin', 'super_admin']

function Nav() {
  const { isAuthenticated, user, logout } = useAuth()
  const isStaff = isAuthenticated && STAFF_ROLES.includes(user.role)

  return (
    <div className="flex justify-between items-center px-6 py-4 max-w-md mx-auto flex-wrap gap-2">
      <Link to="/" className="text-sm font-bold text-brand-violet">
        GraphiTech Academy
      </Link>
      {isAuthenticated ? (
        <div className="flex items-center gap-3 text-sm">
          <Link to="/tutor" className="text-brand-purple font-semibold">
            AI Tutor
          </Link>
          {isStaff && (
            <Link to="/admin/courses" className="text-brand-purple font-semibold">
              Admin
            </Link>
          )}
          <button onClick={logout} className="text-slate-500">
            Log out
          </button>
        </div>
      ) : (
        <Link to="/login" className="text-sm text-brand-purple font-semibold">
          Log in
        </Link>
      )}
    </div>
  )
}

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
      <p className="text-xs text-slate-400 mt-10">Backend status: {apiStatus}</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:slug" element={<CourseDetail />} />
          <Route path="/tutor" element={<Tutor />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/courses/:id" element={<AdminCourseDetail />} />
          <Route path="/admin/ai-draft" element={<AdminAIDraft />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
