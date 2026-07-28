import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { FormInput, PrimaryButton, ErrorMessage } from '../../components/FormControls'

export default function AdminLearningPaths() {
  const [paths, setPaths] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', slug: '', description: '' })

  function load() {
    api
      .get('/api/admin/learning-paths')
      .then(setPaths)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  function slugify(text) {
    return text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
  }

  async function handleCreate(e) {
    e.preventDefault()
    setError('')
    try {
      await api.post('/api/learning-paths', form)
      setForm({ title: '', slug: '', description: '' })
      setShowForm(false)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function togglePublish(path) {
    setError('')
    try {
      await api.patch(`/api/learning-paths/${path.id}`, { is_published: !path.is_published })
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-[calc(100vh-73px-42px)] px-6 py-8">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="font-mono text-xs text-brand-sky mb-1">$ admin/learning-paths</p>
            <h1 className="font-display font-bold text-xl text-white">Categories</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-sm bg-brand-purple text-white px-4 py-2 rounded-full font-semibold"
          >
            + New
          </button>
        </div>

        <ErrorMessage message={error} />

        {showForm && (
          <form onSubmit={handleCreate} className="bg-surface border border-white/5 rounded-xl p-4 mb-4">
            <FormInput
              label="Title"
              required
              value={form.title}
              onChange={(e) => {
                const title = e.target.value
                setForm({ ...form, title, slug: slugify(title) })
              }}
              placeholder="e.g. Web & App Development"
            />
            <FormInput
              label="Slug"
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
            <label className="block text-left mb-4">
              <span className="text-sm font-medium text-white/70">Description</span>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-white/10 bg-ink px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </label>
            <PrimaryButton type="submit">Create Category</PrimaryButton>
          </form>
        )}

        {loading && <p className="text-white/40 font-mono text-sm">loading…</p>}

        <div className="space-y-2">
          {paths.map((path) => (
            <div key={path.id} className="bg-surface border border-white/5 rounded-xl p-4">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <p className="text-white font-semibold">{path.title}</p>
                  <p className="text-xs text-white/40 font-mono">{path.slug}</p>
                </div>
                <button
                  onClick={() => togglePublish(path)}
                  className={`text-xs font-mono px-2 py-1 rounded-full shrink-0 ${
                    path.is_published
                      ? 'bg-brand-green/10 text-brand-green'
                      : 'bg-brand-amber/10 text-brand-amber'
                  }`}
                >
                  {path.is_published ? 'published' : 'draft'}
                </button>
              </div>
              {path.description && (
                <p className="text-sm text-white/50 mt-2">{path.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
