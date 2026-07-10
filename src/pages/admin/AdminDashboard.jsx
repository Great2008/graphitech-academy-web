import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'

function StatCard({ label, value, accent = 'text-white' }) {
  return (
    <div className="bg-surface border border-white/5 rounded-xl p-4">
      <p className={`font-display font-bold text-2xl ${accent}`}>{value}</p>
      <p className="text-xs text-white/40 font-mono mt-1">{label}</p>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/admin/dashboard').then(setStats).catch((err) => setError(err.message))
  }, [])

  return (
    <div className="min-h-[calc(100vh-73px)] px-6 py-8">
      <div className="max-w-md mx-auto">
        <p className="font-mono text-xs text-brand-sky mb-1">$ admin/dashboard</p>
        <h1 className="font-display font-bold text-xl text-white mb-6">Overview</h1>

        {error && <p className="text-brand-red font-mono text-sm mb-4">{error}</p>}

        {stats && (
          <>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <StatCard label="students" value={stats.total_students} accent="text-brand-purple" />
              <StatCard label="staff" value={stats.total_staff} accent="text-brand-sky" />
              <StatCard label="published courses" value={stats.total_courses_published} accent="text-brand-green" />
              <StatCard label="draft courses" value={stats.total_courses_draft} accent="text-brand-amber" />
              <StatCard label="enrollments" value={stats.total_enrollments} />
              <StatCard label="completed" value={stats.total_completed_enrollments} accent="text-brand-green" />
              <StatCard label="certificates issued" value={stats.total_certificates_issued} accent="text-brand-purple" />
              <StatCard
                label="capstones pending review"
                value={stats.pending_capstone_reviews}
                accent={stats.pending_capstone_reviews > 0 ? 'text-brand-amber' : 'text-white'}
              />
            </div>

            <div className="space-y-2">
              <Link
                to="/admin/students"
                className="block bg-surface border border-white/5 rounded-xl p-4 hover:border-brand-purple/40 transition"
              >
                <p className="text-white font-semibold">Students</p>
                <p className="text-xs text-white/40 font-mono mt-0.5">view roster &amp; progress</p>
              </Link>
              <Link
                to="/admin/courses"
                className="block bg-surface border border-white/5 rounded-xl p-4 hover:border-brand-purple/40 transition"
              >
                <p className="text-white font-semibold">Courses</p>
                <p className="text-xs text-white/40 font-mono mt-0.5">manage &amp; publish</p>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
