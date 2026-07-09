import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

export default function CourseList() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/api/courses')
      .then(setCourses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-sky-50 px-6 py-10">
      <p className="text-xs tracking-[0.3em] text-brand-purple font-bold uppercase text-center mb-1">
        GraphiTech Academy
      </p>
      <h1 className="text-2xl font-extrabold text-brand-violet text-center mb-8">
        Courses
      </h1>

      {loading && <p className="text-center text-slate-500">Loading courses…</p>}
      {error && <p className="text-center text-red-600">{error}</p>}
      {!loading && !error && courses.length === 0 && (
        <p className="text-center text-slate-500">No courses published yet — check back soon.</p>
      )}

      <div className="max-w-md mx-auto space-y-4">
        {courses.map((course) => (
          <Link
            key={course.id}
            to={`/courses/${course.slug}`}
            className="block bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition"
          >
            <h2 className="text-lg font-bold text-brand-violet mb-1">{course.title}</h2>
            {course.description && (
              <p className="text-sm text-slate-600 line-clamp-2">{course.description}</p>
            )}
            <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
              {course.certificate_fee_kobo ? (
                <span>Certificate ₦{(course.certificate_fee_kobo / 100).toLocaleString()}</span>
              ) : (
                <span>Free certificate</span>
              )}
              {course.requires_capstone && <span>&middot; Capstone required</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
