import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { EditorWindow } from '../components/EditorWindow'

export default function MyCertificates() {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/api/certificates/me')
      .then(setCertificates)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-[calc(100vh-73px-42px)] px-6 py-8">
      <div className="max-w-md mx-auto">
        <p className="font-mono text-xs text-brand-green mb-1">$ ls certificates/</p>
        <h1 className="font-display font-bold text-xl text-white mb-6">My Certificates</h1>

        {loading && <p className="text-white/40 font-mono text-sm">loading…</p>}
        {error && <p className="text-brand-red font-mono text-sm">{error}</p>}
        {!loading && certificates.length === 0 && (
          <div className="border border-dashed border-white/10 rounded-xl p-8 text-center">
            <p className="text-white/40 text-sm">
              No certificates yet. Complete a course and its capstone to earn one.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {certificates.map((cert) => (
            <EditorWindow key={cert.id} label={`${cert.certificate_number}.pdf`}>
              <p className="font-display font-semibold text-white mb-1">
                {cert.course_title_snapshot}
              </p>
              <p className="text-xs text-white/40 font-mono mb-3">
                {cert.status === 'valid' ? (
                  <span className="text-brand-green">valid</span>
                ) : (
                  <span className="text-brand-red">revoked</span>
                )}
                {cert.grade_percent && ` · grade: ${cert.grade_percent}%`}
              </p>
              <div className="flex gap-3">
                {cert.pdf_url && (
                  <a
                    href={cert.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-brand-sky font-mono"
                  >
                    download pdf ↗
                  </a>
                )}
                <Link
                  to={`/verify/${cert.certificate_number}`}
                  className="text-sm text-brand-purple font-mono"
                >
                  verify ↗
                </Link>
              </div>
            </EditorWindow>
          ))}
        </div>
      </div>
    </div>
  )
}
