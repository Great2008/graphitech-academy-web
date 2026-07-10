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
    <div className="min-h-[calc(100vh-73px)] px-6 py-10">
      <div className="max-w-md mx-auto">
        <p className="font-mono text-xs text-brand-green mb-2">$ ls courses/</p>
        <h1 className="font-display font-bold text-2xl text-white mb-8">
          Courses
        </h1>

        {loading && <p className="text-white/40 font-mono text-sm">loading…</p>}
        {error && <p className="text-brand-red font-mono text-sm">{error}</p>}
        {!loading && !error && courses.length === 0 && (
          <div className="border border-dashed border-white/10 rounded-xl p-8 text-center">
            <p className="text-white/40 text-sm">
              No courses published yet — check back soon.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.slug}`}
              className="block bg-surface border border-white/5 rounded-xl p-5 hover:border-brand-purple/40 transition group"
            >
              <h2 className="font-display font-semibold text-white mb-1 group-hover:text-brand-purple transition">
                {course.title}
              </h2>
              {course.description && (
                <p className="text-sm text-white/50 line-clamp-2 mb-3">{course.description}</p>
              )}
              <div className="flex items-center gap-3 font-mono text-xs text-white/30">
                {course.certificate_fee_kobo ? (
                  <span className="text-brand-amber">
                    ₦{(course.certificate_fee_kobo / 100).toLocaleString()} certificate
                  </span>
                ) : (
                  <span className="text-brand-green">free certificate</span>
                )}
                {course.requires_capstone && <span>&middot; capstone required</span>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
