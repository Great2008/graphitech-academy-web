import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'

export default function AdminStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/api/admin/students')
      .then(setStudents)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-[calc(100vh-73px)] px-6 py-8">
      <div className="max-w-md mx-auto">
        <p className="font-mono text-xs text-brand-sky mb-1">$ admin/students</p>
        <h1 className="font-display font-bold text-xl text-white mb-6">
          Students ({students.length})
        </h1>

        {loading && <p className="text-white/40 font-mono text-sm">loading…</p>}
        {error && <p className="text-brand-red font-mono text-sm">{error}</p>}
        {!loading && students.length === 0 && (
          <p className="text-white/40 text-sm">No students have signed up yet.</p>
        )}

        <div className="space-y-2">
          {students.map((s) => (
            <Link
              key={s.id}
              to={`/admin/students/${s.id}`}
              className="block bg-surface border border-white/5 rounded-xl p-4 hover:border-brand-purple/40 transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-semibold">{s.display_name || s.username}</p>
                  <p className="text-xs text-white/40 font-mono">@{s.username}</p>
                </div>
                <div className="text-right font-mono text-xs">
                  <p className="text-brand-sky">{s.enrollment_count} enrolled</p>
                  <p className="text-brand-green">{s.completed_count} completed</p>
                  {s.certificate_count > 0 && (
                    <p className="text-brand-purple">{s.certificate_count} certified</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
