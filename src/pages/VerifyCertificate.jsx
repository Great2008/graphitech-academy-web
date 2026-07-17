import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api, API_URL } from '../lib/api'
import { EditorWindow } from '../components/EditorWindow'

export default function VerifyCertificate() {
  const { certificateNumber } = useParams()
  const [cert, setCert] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get(`/api/verify/${certificateNumber}`)
      .then(setCert)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [certificateNumber])

  return (
    <div className="min-h-[calc(100vh-73px-42px)] flex items-center justify-center px-6 py-12">
      <EditorWindow label="verify.sh" className="w-full max-w-md">
        <p className="font-mono text-xs text-brand-sky mb-4">
          $ verify {certificateNumber}
        </p>

        {loading && <p className="text-white/40 font-mono text-sm">checking…</p>}

        {error && (
          <>
            <h1 className="font-display font-bold text-xl text-brand-red mb-2">
              Not a valid certificate
            </h1>
            <p className="text-white/50 text-sm">
              No certificate found matching this number. It may not exist,
              or the number was mistyped.
            </p>
          </>
        )}

        {cert && (
          <>
            <div className="flex items-center gap-2 mb-6">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  cert.status === 'valid' ? 'bg-brand-green' : 'bg-brand-red'
                }`}
              />
              <span
                className={`font-mono text-sm font-semibold ${
                  cert.status === 'valid' ? 'text-brand-green' : 'text-brand-red'
                }`}
              >
                {cert.status === 'valid' ? 'VALID CERTIFICATE' : 'REVOKED'}
              </span>
            </div>

            <p className="text-xs text-white/40 font-mono mb-1">student</p>
            <p className="font-display font-semibold text-lg text-white mb-4">
              {cert.student_name_snapshot}
            </p>

            <p className="text-xs text-white/40 font-mono mb-1">course</p>
            <p className="text-white/80 mb-4">{cert.course_title_snapshot}</p>

            {cert.grade_percent && (
              <>
                <p className="text-xs text-white/40 font-mono mb-1">grade</p>
                <p className="text-white/80 mb-4">{cert.grade_percent}%</p>
              </>
            )}

            <p className="text-xs text-white/40 font-mono mb-1">issued</p>
            <p className="text-white/80 mb-6">{cert.issued_at?.slice(0, 10) || '—'}</p>

            <p className="font-mono text-xs text-white/30 mb-6">
              certificate no. {cert.certificate_number}
            </p>

            {cert.status === 'valid' && (
              <a
                href={`${API_URL}/api/certificates/${cert.certificate_number}/download`}
                target="_blank"
                rel="noreferrer"
                className="block text-center bg-brand-purple text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-brand-purple/20 hover:opacity-90 transition"
              >
                Download PDF
              </a>
            )}
          </>
        )}
      </EditorWindow>
    </div>
  )
}
