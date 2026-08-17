import { useState } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../lib/AuthContext'
import { EditorWindow } from '../components/EditorWindow'
import { FormInput, PrimaryButton, ErrorMessage } from '../components/FormControls'

export default function Profile() {
  const { user, refreshUser } = useAuth()
  const [form, setForm] = useState({
    display_name: user?.display_name || '',
    bio: user?.bio || '',
    github_url: user?.github_url || '',
    linkedin_url: user?.linkedin_url || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaved(false)
    setLoading(true)
    try {
      await api.patch('/api/auth/me', form)
      if (refreshUser) await refreshUser()
      setSaved(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-73px-42px)] flex items-center justify-center px-6 text-center">
        <p className="text-white/40 font-mono text-sm">log in to edit your profile.</p>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-73px-42px)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <EditorWindow label="profile.sh">
          <p className="font-mono text-xs text-brand-green mb-4">$ ./edit-profile</p>
          <h1 className="font-display font-bold text-xl text-white mb-2">Your Profile</h1>
          <p className="text-sm text-white/40 mb-6">
            Your display name is what appears on certificates — set it to
            your real name so certificates carry it, not your username.
          </p>

          <form onSubmit={handleSubmit}>
            <ErrorMessage message={error} />
            {saved && (
              <p className="text-sm text-brand-green bg-brand-green/10 border border-brand-green/20 rounded-lg px-4 py-2 mb-4 font-mono">
                Saved.
              </p>
            )}
            <FormInput
              label="Display name (used on certificates)"
              value={form.display_name}
              onChange={(e) => setForm({ ...form, display_name: e.target.value })}
              placeholder="e.g. Chukwuguzoninam Okafor"
            />
            <label className="block text-left mb-4">
              <span className="text-sm font-medium text-white/70">Bio</span>
              <textarea
                rows={3}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                maxLength={500}
                className="mt-1.5 w-full rounded-lg border border-white/10 bg-ink px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </label>
            <FormInput
              label="GitHub URL"
              type="url"
              value={form.github_url}
              onChange={(e) => setForm({ ...form, github_url: e.target.value })}
              placeholder="https://github.com/yourname"
            />
            <FormInput
              label="LinkedIn URL"
              type="url"
              value={form.linkedin_url}
              onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
              placeholder="https://linkedin.com/in/yourname"
            />
            <PrimaryButton type="submit" loading={loading}>
              Save Profile
            </PrimaryButton>
          </form>
        </EditorWindow>
      </div>
    </div>
  )
}
