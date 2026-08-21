import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import { Loader } from '../../components/Loader'
import { ErrorMessage } from '../../components/FormControls'

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [revokeReason, setRevokeReason] = useState({})
  const [showRevokeFor, setShowRevokeFor] = useState(null)

  function load() {
    api
      .get('/api/admin/certificates')
      .then(setCertificates)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleRevoke(id) {
    setError('')
    try {
      await api.post(`/api/certificates/${id}/revoke`, { reason: revokeReason[id] || 'Revoked by admin' })
      setShowRevokeFor(null)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-[calc(100vh-73px-42px)] px-6 py-8">
      <div className="max-w-md mx-auto">
        <p className="font-mono text-xs text-brand-sky mb-1">$ admin/certificates</p>
        <h1 className="font-display font-bold text-xl text-white mb-6">
          Certificates ({certificates.length})
        </h1>

        <ErrorMessage message={error} />
        {loading && <Loader />}
        {!loading && certificates.length === 0 && (
          <p className="text-white/40 text-sm">No certificates issued yet.</p>
        )}

        <div className="space-y-3">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-surface border border-white/5 rounded-xl p-4">
              <div className="flex justify-between items-start gap-2 mb-1">
                <p className="font-semibold text-white">{cert.student_name_snapshot}</p>
                <span
                  className={`text-xs font-mono shrink-0 ${
                    cert.status === 'valid' ? 'text-brand-green' : 'text-brand-red'
                  }`}
                >
                  {cert.status}
                </span>
              </div>
              <p className="text-sm text-white/60 mb-1">{cert.course_title_snapshot}</p>
              <p className="text-xs text-white/30 font-mono mb-2">{cert.certificate_number}</p>

              <div className="flex gap-3 items-center">
                <Link to={`/verify/${cert.certificate_number}`} className="text-xs text-brand-sky font-mono">
                  verify ↗
                </Link>
                {cert.status === 'valid' && (
                  <button
                    onClick={() => setShowRevokeFor(showRevokeFor === cert.id ? null : cert.id)}
                    className="text-xs text-brand-red font-mono"
                  >
                    revoke
                  </button>
                )}
              </div>

              {showRevokeFor === cert.id && (
                <div className="mt-3 flex gap-2">
                  <input
                    value={revokeReason[cert.id] || ''}
                    onChange={(e) => setRevokeReason({ ...revokeReason, [cert.id]: e.target.value })}
                    placeholder="Reason (optional)"
                    className="flex-1 bg-ink border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                  <button
                    onClick={() => handleRevoke(cert.id)}
                    className="bg-brand-red/10 text-brand-red text-xs font-semibold px-3 py-1.5 rounded-lg"
                  >
                    Confirm
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
