import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { ErrorMessage } from '../../components/FormControls'

export default function AdminCapstones() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState({})

  function load() {
    api
      .get('/api/capstones')
      .then(setSubmissions)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleReview(id, decision) {
    setError('')
    try {
      await api.post(`/api/capstones/${id}/review`, {
        status: decision,
        reviewer_feedback: feedback[id] || '',
      })
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-[calc(100vh-73px-42px)] px-6 py-8">
      <div className="max-w-md mx-auto">
        <p className="font-mono text-xs text-brand-sky mb-1">$ admin/capstones</p>
        <h1 className="font-display font-bold text-xl text-white mb-6">
          Pending Reviews ({submissions.length})
        </h1>

        <ErrorMessage message={error} />
        {loading && <p className="text-white/40 font-mono text-sm">loading…</p>}
        {!loading && submissions.length === 0 && (
          <p className="text-white/40 text-sm">Nothing waiting on review.</p>
        )}

        <div className="space-y-4">
          {submissions.map((s) => (
            <div key={s.id} className="bg-surface border border-white/5 rounded-xl p-4">
              <p className="font-semibold text-white mb-1">{s.title}</p>
              {s.description && <p className="text-sm text-white/50 mb-2">{s.description}</p>}
              <div className="flex gap-3 text-xs font-mono mb-3">
                {s.repo_url && (
                  <a href={s.repo_url} target="_blank" rel="noreferrer" className="text-brand-sky">
                    repo ↗
                  </a>
                )}
                {s.live_url && (
                  <a href={s.live_url} target="_blank" rel="noreferrer" className="text-brand-sky">
                    live ↗
                  </a>
                )}
              </div>
              <textarea
                placeholder="Feedback (optional)"
                rows={2}
                value={feedback[s.id] || ''}
                onChange={(e) => setFeedback({ ...feedback, [s.id]: e.target.value })}
                className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-purple mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleReview(s.id, 'approved')}
                  className="flex-1 bg-brand-green/10 text-brand-green font-semibold py-2 rounded-full text-sm"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReview(s.id, 'rejected')}
                  className="flex-1 bg-brand-red/10 text-brand-red font-semibold py-2 rounded-full text-sm"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
