import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'

const STATUS_COLORS = {
  draft: 'bg-brand-amber/10 text-brand-amber',
  published: 'bg-brand-green/10 text-brand-green',
  archived: 'bg-white/5 text-white/40',
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
    <div className="min-h-[calc(100vh-73px)] px-6 py-8">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="font-mono text-xs text-brand-sky mb-1">$ admin/courses</p>
            <h1 className="font-display font-bold text-xl text-white">All Courses</h1>
          </div>
          <Link
            to="/admin/ai-draft"
            className="text-sm bg-brand-purple text-white px-4 py-2 rounded-full font-semibold whitespace-nowrap"
          >
            + AI Draft
          </Link>
        </div>

        {loading && <p className="text-white/40 font-mono text-sm">loading…</p>}
        {error && <p className="text-brand-red font-mono text-sm">{error}</p>}

        <div className="space-y-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/admin/courses/${course.id}`}
              className="block bg-surface border border-white/5 rounded-xl p-4 hover:border-brand-purple/40 transition"
            >
              <div className="flex justify-between items-start gap-2">
                <h2 className="font-semibold text-white">{course.title}</h2>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-mono shrink-0 ${STATUS_COLORS[course.status]}`}
                >
                  {course.status}
                </span>
              </div>
              <p className="text-xs text-white/30 font-mono mt-1">
                v{course.version} &middot; {course.generated_by_ai ? 'ai-generated' : 'manual'}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
