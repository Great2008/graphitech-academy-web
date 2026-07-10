import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import { FormInput, PrimaryButton, ErrorMessage } from '../../components/FormControls'

export default function AdminAIDraft() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    topic: '',
    target_lesson_count: 6,
    audience_level: 'beginner',
    include_quizzes: true,
    include_capstone: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const course = await api.post('/api/courses/ai-draft', form)
      navigate(`/admin/courses/${course.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-73px)] px-6 py-8">
      <div className="max-w-md mx-auto">
        <p className="font-mono text-xs text-brand-amber mb-1">$ groq/draft-course</p>
        <h1 className="font-display font-bold text-xl text-white mb-1">AI Course Draft</h1>
        <p className="text-sm text-white/50 mb-6">
          Groq drafts a full outline. Nothing publishes automatically —
          review it on the next screen first.
        </p>

        <form onSubmit={handleSubmit} className="bg-surface border border-white/5 rounded-2xl p-6">
          <ErrorMessage message={error} />
          <FormInput
            label="Topic"
            required
            value={form.topic}
            onChange={(e) => setForm({ ...form, topic: e.target.value })}
            placeholder="e.g. Python basics for beginners"
          />
          <FormInput
            label="Number of lessons"
            type="number"
            min={1}
            max={40}
            value={form.target_lesson_count}
            onChange={(e) => setForm({ ...form, target_lesson_count: Number(e.target.value) })}
          />
          <label className="block text-left mb-4">
            <span className="text-sm font-medium text-white/70">Audience level</span>
            <select
              value={form.audience_level}
              onChange={(e) => setForm({ ...form, audience_level: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-white/10 bg-ink px-4 py-3 text-white"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </label>
          <label className="flex items-center gap-2 mb-3 text-sm text-white/70">
            <input
              type="checkbox"
              checked={form.include_quizzes}
              onChange={(e) => setForm({ ...form, include_quizzes: e.target.checked })}
            />
            Include quizzes
          </label>
          <label className="flex items-center gap-2 mb-6 text-sm text-white/70">
            <input
              type="checkbox"
              checked={form.include_capstone}
              onChange={(e) => setForm({ ...form, include_capstone: e.target.checked })}
            />
            Require a capstone project
          </label>
          <PrimaryButton type="submit" loading={loading}>
            Generate Draft
          </PrimaryButton>
        </form>
      </div>
    </div>
  )
}
