import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'

const STATUS_COLORS = {
  draft: 'bg-amber-100 text-amber-700',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-slate-100 text-slate-500',
}

export default function AdminCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/api/admin/courses')
      .then(setCourses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-sky-50 px-6 py-8">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-extrabold text-brand-violet">Admin · Courses</h1>
          <Link
            to="/admin/ai-draft"
            className="text-sm bg-brand-purple text-white px-4 py-2 rounded-full font-semibold"
          >
            + AI Draft
          </Link>
        </div>

        {loading && <p className="text-slate-500 text-center">Loading…</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}

        <div className="space-y-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/admin/courses/${course.id}`}
              className="block bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start gap-2">
                <h2 className="font-semibold text-brand-violet">{course.title}</h2>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${STATUS_COLORS[course.status]}`}
                >
                  {course.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                v{course.version} &middot; {course.generated_by_ai ? 'AI-generated' : 'Manual'}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
