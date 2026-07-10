import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import { PrimaryButton, FormInput, ErrorMessage } from '../../components/FormControls'

export default function AdminCourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  const [newLesson, setNewLesson] = useState({ title: '', content_markdown: '' })
  const [showAddLesson, setShowAddLesson] = useState(false)

  function load() {
    api
      .get(`/api/admin/courses/${id}`)
      .then(setCourse)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [id])

  async function handlePublish() {
    setError('')
    try {
      await api.post(`/api/courses/${id}/publish`)
      setMsg('Published — live on the site now.')
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleNewVersion() {
    setError('')
    try {
      const newCourse = await api.post(`/api/courses/${id}/new-version`)
      navigate(`/admin/courses/${newCourse.id}`)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleAddLesson(e) {
    e.preventDefault()
    setError('')
    try {
      await api.post(`/api/courses/${id}/lessons`, {
        title: newLesson.title,
        order_index: course.lessons.length,
        content_markdown: newLesson.content_markdown,
      })
      setNewLesson({ title: '', content_markdown: '' })
      setShowAddLesson(false)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDeleteLesson(lessonId) {
    setError('')
    try {
      await api.delete(`/api/courses/${id}/lessons/${lessonId}`)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <p className="text-center mt-20 text-white/40 font-mono text-sm">loading…</p>
  if (!course) return <p className="text-center mt-20 text-brand-red font-mono text-sm">{error}</p>

  const isDraft = course.status === 'draft'

  return (
    <div className="min-h-[calc(100vh-73px)] px-6 py-8">
      <div className="max-w-md mx-auto">
        <p className="font-mono text-xs text-brand-sky mb-1">$ admin/courses/{course.id.slice(0, 8)}</p>
        <h1 className="font-display font-bold text-xl text-white mb-1">{course.title}</h1>
        <p className="text-xs text-white/30 font-mono mb-4">
          status: {course.status} &middot; v{course.version}
        </p>

        <ErrorMessage message={error} />
        {msg && <p className="text-sm text-brand-green font-mono mb-4">{msg}</p>}

        <div className="flex gap-2 mb-6">
          {isDraft ? (
            <PrimaryButton onClick={handlePublish}>Publish Course</PrimaryButton>
          ) : (
            <button
              onClick={handleNewVersion}
              className="w-full border border-brand-purple text-brand-purple font-semibold py-3 rounded-full hover:bg-brand-purple/10 transition"
            >
              Create New Version to Edit
            </button>
          )}
        </div>

        <h2 className="font-display font-semibold text-white mb-2">
          Lessons ({course.lessons?.length || 0})
        </h2>

        <div className="space-y-2 mb-4">
          {course.lessons?.map((lesson, i) => (
            <div key={lesson.id} className="bg-surface border border-white/5 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <p className="font-medium text-white/90">
                  {String(i + 1).padStart(2, '0')}. {lesson.title}
                </p>
                {isDraft && (
                  <button
                    onClick={() => handleDeleteLesson(lesson.id)}
                    className="text-xs text-brand-red font-mono shrink-0"
                  >
                    delete
                  </button>
                )}
              </div>
              <p className="text-xs text-white/30 mt-1 line-clamp-2">
                {lesson.content_markdown}
              </p>
            </div>
          ))}
        </div>

        {isDraft && (
          <>
            {!showAddLesson ? (
              <button
                onClick={() => setShowAddLesson(true)}
                className="text-sm text-brand-sky font-mono"
              >
                + add lesson manually
              </button>
            ) : (
              <form onSubmit={handleAddLesson} className="bg-surface border border-white/5 rounded-xl p-4 mt-2">
                <FormInput
                  label="Lesson title"
                  required
                  value={newLesson.title}
                  onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                />
                <label className="block text-left mb-4">
                  <span className="text-sm font-medium text-white/70">Content (Markdown)</span>
                  <textarea
                    required
                    rows={6}
                    value={newLesson.content_markdown}
                    onChange={(e) => setNewLesson({ ...newLesson, content_markdown: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-white/10 bg-ink px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                </label>
                <PrimaryButton type="submit">Add Lesson</PrimaryButton>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}
