import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../../lib/api'

const STATUS_COLORS = {
  active: 'text-brand-sky',
  completed: 'text-brand-green',
  dropped: 'text-white/30',
}

export default function AdminStudentDetail() {
  const { id } = useParams()
  const [student, setStudent] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/api/admin/students/${id}`).then(setStudent).catch((err) => setError(err.message))
  }, [id])

  if (error) return <p className="text-center mt-20 text-brand-red font-mono text-sm">{error}</p>
  if (!student) return <p className="text-center mt-20 text-white/40 font-mono text-sm">loading…</p>

  return (
    <div className="min-h-[calc(100vh-73px)] px-6 py-8">
      <div className="max-w-md mx-auto">
        <p className="font-mono text-xs text-brand-sky mb-1">$ admin/students/{student.username}</p>
        <h1 className="font-display font-bold text-xl text-white mb-1">
          {student.display_name || student.username}
        </h1>
        <p className="text-xs text-white/40 font-mono mb-6">{student.email}</p>

        <h2 className="font-display font-semibold text-white mb-3">
          Enrollments ({student.enrollments.length})
        </h2>

        {student.enrollments.length === 0 && (
          <p className="text-white/40 text-sm">Not enrolled in any courses yet.</p>
        )}

        <div className="space-y-3">
          {student.enrollments.map((e) => (
            <div key={e.course_id} className="bg-surface border border-white/5 rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="font-semibold text-white">{e.course_title}</p>
                <span className={`text-xs font-mono ${STATUS_COLORS[e.status] || 'text-white/40'}`}>
                  {e.status}
                </span>
              </div>
              <div className="w-full bg-ink rounded-full h-2 mb-1">
                <div
                  className="bg-brand-purple h-2 rounded-full transition-all"
                  style={{ width: `${e.progress_percent}%` }}
                />
              </div>
              <p className="text-xs text-white/40 font-mono">
                {e.completed_lessons}/{e.total_lessons} lessons &middot; {e.progress_percent}%
                {e.is_eligible_for_certificate && (
                  <span className="text-brand-green"> &middot; certificate eligible</span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
