import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { EditorWindow } from '../components/EditorWindow'
import { FormInput, PrimaryButton, ErrorMessage } from '../components/FormControls'

export default function CapstoneSubmit() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', description: '', repo_url: '', live_url: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/api/capstones', { course_id: courseId, ...form })
      setSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-73px-42px)] flex items-center justify-center px-6 py-12">
        <EditorWindow label="submitted.md" className="w-full max-w-md text-center">
          <p className="font-mono text-xs text-brand-green mb-4">$ status</p>
          <h1 className="font-display font-bold text-xl text-white mb-3">Capstone submitted</h1>
          <p className="text-white/60 mb-6">
            An instructor will review it soon. You'll be able to claim your
            certificate once it's approved.
          </p>
          <button
            onClick={() => navigate('/courses')}
            className="text-brand-sky font-mono text-sm"
          >
            back to courses
          </button>
        </EditorWindow>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-73px-42px)] px-6 py-8">
      <div className="max-w-md mx-auto">
        <p className="font-mono text-xs text-brand-green mb-1">$ ./submit-capstone</p>
        <h1 className="font-display font-bold text-xl text-white mb-6">Submit Capstone</h1>

        <form onSubmit={handleSubmit} className="bg-surface border border-white/5 rounded-2xl p-6">
          <ErrorMessage message={error} />
          <FormInput
            label="Project title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. My Portfolio Site"
          />
          <label className="block text-left mb-4">
            <span className="text-sm font-medium text-white/70">Description</span>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-white/10 bg-ink px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-purple"
              placeholder="What does it do? What did you learn?"
            />
          </label>
          <FormInput
            label="Repo URL"
            type="url"
            value={form.repo_url}
            onChange={(e) => setForm({ ...form, repo_url: e.target.value })}
            placeholder="https://github.com/you/project"
          />
          <FormInput
            label="Live URL (optional)"
            type="url"
            value={form.live_url}
            onChange={(e) => setForm({ ...form, live_url: e.target.value })}
            placeholder="https://your-project.vercel.app"
          />
          <PrimaryButton type="submit" loading={loading}>
            Submit for Review
          </PrimaryButton>
        </form>
      </div>
    </div>
  )
}
