import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { api } from '../lib/api'
import { useAuth } from '../lib/AuthContext'
import { PrimaryButton } from '../components/FormControls'

export default function CourseDetail() {
  const { slug } = useParams()
  const { isAuthenticated } = useAuth()

  const [course, setCourse] = useState(null)
  const [activeLesson, setActiveLesson] = useState(null)
  const [enrolled, setEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionMsg, setActionMsg] = useState('')

  useEffect(() => {
    api
      .get(`/api/courses/${slug}`)
      .then((data) => {
        setCourse(data)
        setActiveLesson(data.lessons?.[0] || null)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  async function handleEnroll() {
    if (!isAuthenticated) {
      setActionMsg('Log in first to enroll.')
      return
    }
    try {
      await api.post(`/api/courses/${course.id}/enroll`)
      setEnrolled(true)
      setActionMsg('Enrolled! Start with the first lesson below.')
    } catch (err) {
      setActionMsg(err.message)
    }
  }

  async function markComplete(lessonId) {
    if (!isAuthenticated) {
      setActionMsg('Log in first to track progress.')
      return
    }
    try {
      await api.post(`/api/courses/${course.id}/progress`, {
        lesson_id: lessonId,
        is_completed: true,
      })
      setActionMsg('Marked complete!')
    } catch (err) {
      setActionMsg(err.message)
    }
  }

  if (loading) return <p className="text-center mt-20 text-slate-500">Loading…</p>
  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>
  if (!course) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-sky-50">
      <div className="max-w-md mx-auto px-6 py-8">
        <h1 className="text-2xl font-extrabold text-brand-violet mb-1">{course.title}</h1>
        {course.description && <p className="text-slate-600 mb-4">{course.description}</p>}

        {!enrolled && (
          <PrimaryButton onClick={handleEnroll} className="mb-4">
            Enroll — Free
          </PrimaryButton>
        )}
        {actionMsg && <p className="text-sm text-brand-purple mb-4">{actionMsg}</p>}

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {course.lessons?.map((lesson, i) => (
            <button
              key={lesson.id}
              onClick={() => setActiveLesson(lesson)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                activeLesson?.id === lesson.id
                  ? 'bg-brand-purple text-white'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {i + 1}. {lesson.title}
            </button>
          ))}
        </div>

        {activeLesson && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold text-brand-violet mb-3">{activeLesson.title}</h2>
            <div className="prose prose-sm max-w-none prose-headings:text-brand-violet prose-a:text-brand-purple">
              <ReactMarkdown>{activeLesson.content_markdown}</ReactMarkdown>
            </div>
            <PrimaryButton onClick={() => markComplete(activeLesson.id)} className="mt-6">
              Mark Lesson Complete
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  )
}
