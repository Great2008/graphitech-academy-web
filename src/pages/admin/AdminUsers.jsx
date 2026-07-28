import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { useAuth } from '../../lib/AuthContext'
import { ErrorMessage } from '../../components/FormControls'

const ROLES = ['student', 'instructor', 'reviewer', 'moderator', 'admin', 'super_admin']

const ROLE_COLORS = {
  student: 'text-white/50',
  instructor: 'text-brand-sky',
  reviewer: 'text-brand-amber',
  moderator: 'text-brand-amber',
  admin: 'text-brand-purple',
  super_admin: 'text-brand-red',
}

export default function AdminUsers() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState(null)

  function load() {
    api
      .get('/api/admin/users')
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleRoleChange(userId, newRole) {
    setError('')
    setSavingId(userId)
    try {
      await api.patch(`/api/admin/users/${userId}/role`, { role: newRole })
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="min-h-[calc(100vh-73px-42px)] px-6 py-8">
      <div className="max-w-md mx-auto">
        <p className="font-mono text-xs text-brand-sky mb-1">$ admin/users</p>
        <h1 className="font-display font-bold text-xl text-white mb-6">
          Users ({users.length})
        </h1>

        <ErrorMessage message={error} />
        {loading && <p className="text-white/40 font-mono text-sm">loading…</p>}

        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="bg-surface border border-white/5 rounded-xl p-4">
              <div className="flex justify-between items-center gap-3">
                <div className="min-w-0">
                  <p className="text-white font-semibold truncate">{u.display_name || u.username}</p>
                  <p className="text-xs text-white/40 font-mono truncate">{u.email}</p>
                </div>
                <select
                  value={u.role}
                  disabled={savingId === u.id || u.id === currentUser.id}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  className={`bg-ink border border-white/10 rounded-lg px-2 py-1.5 text-xs font-mono shrink-0 ${ROLE_COLORS[u.role] || 'text-white'} disabled:opacity-40`}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              {u.id === currentUser.id && (
                <p className="text-xs text-white/30 font-mono mt-2">this is you — role locked</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
