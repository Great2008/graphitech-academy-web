import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { api } from '../lib/api'
import { useAuth } from '../lib/AuthContext'
import { EditorWindow } from '../components/EditorWindow'
import { PrimaryButton } from '../components/FormControls'

function lessonFileName(title, index) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 24)
  return `${String(index + 1).padStart(2, '0')}-${slug}.md`
}

export default function CourseDetail() {
  const { slug } = useParams()
  const { isAuthenticated } = useAuth()

  const [course, setCourse] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [enrolled, setEnrolled] = useState(false)
  const [isEligible, setIsEligible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionMsg, setActionMsg] = useState('')

  useEffect(() => {
    api
      .get(`/api/courses/${slug}`)
      .then(setCourse)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (!course || !isAuthenticated) return
    api
      .get(`/api/courses/${course.id}/enrollment`)
      .then((enrollment) => {
        setEnrolled(true)
        setIsEligible(enrollment.is_eligible_for_certificate)
      })
      .catch(() => {
        // 404 just means not enrolled yet — expected, not an error to show.
        setEnrolled(false)
      })
  }, [course, isAuthenticated])

  async function handleEnroll() {
    if (!isAuthenticated) {
      setActionMsg('Log in first to enroll.')
      return
    }
    try {
      const enrollment = await api.post(`/api/courses/${course.id}/enroll`)
      setEnrolled(true)
      setIsEligible(enrollment.is_eligible_for_certificate)
      setActionMsg('Enrolled. Start with lesson one below.')
    } catch (err) {
      setActionMsg(err.message)
    }
  }

  async function refreshEnrollment() {
    try {
      const enrollment = await api.get(`/api/courses/${course.id}/enrollment`)
      setIsEligible(enrollment.is_eligible_for_certificate)
    } catch {
      // not enrolled — nothing to refresh
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
      setActionMsg('Marked complete.')
      refreshEnrollment()
    } catch (err) {
      setActionMsg(err.message)
    }
  }

  async function claimCertificate() {
    setActionMsg('')
    try {
      await api.post(`/api/certificates/claim/${course.id}`)
      setActionMsg('Certificate claimed! Check "My Certificates" in the menu.')
    } catch (err) {
      setActionMsg(err.message)
    }
  }

  if (loading) return <p className="text-center mt-20 text-white/40 font-mono text-sm">loading…</p>
  if (error) return <p className="text-center mt-20 text-brand-red font-mono text-sm">{error}</p>
  if (!course) return null

  const activeLesson = course.lessons?.[activeIndex]

  return (
    <div className="min-h-[calc(100vh-73px)] px-6 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="font-display font-bold text-2xl text-white mb-1">{course.title}</h1>
        {course.description && <p className="text-white/50 mb-5">{course.description}</p>}

        {!enrolled && (
          <PrimaryButton onClick={handleEnroll} className="mb-4">
            Enroll — Free
          </PrimaryButton>
        )}

        {enrolled && (
          <div className="flex gap-2 mb-4">
            {course.requires_capstone && (
              <Link
                to={`/courses/${course.id}/capstone`}
                className="flex-1 text-center border border-white/10 text-white/80 px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-white/5 transition"
              >
                Submit Capstone
              </Link>
            )}
            {isEligible ? (
              <button
                onClick={claimCertificate}
                className="flex-1 text-center bg-brand-green/10 text-brand-green px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-green/20 transition"
              >
                Claim Certificate
              </button>
            ) : (
              <p className="flex-1 text-center text-xs text-white/30 font-mono self-center">
                complete all lessons{course.requires_capstone ? ' + capstone' : ''} to unlock certificate
              </p>
            )}
          </div>
        )}

        {actionMsg && <p className="text-sm text-brand-sky font-mono mb-4">{actionMsg}</p>}

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {course.lessons?.map((lesson, i) => (
            <button
              key={lesson.id}
              onClick={() => setActiveIndex(i)}
              className={`shrink-0 px-3 py-2 rounded-lg text-xs font-mono whitespace-nowrap transition ${
                activeIndex === i
                  ? 'bg-brand-purple text-white'
                  : 'bg-surface text-white/50 border border-white/5 hover:border-white/20'
              }`}
            >
              {String(i + 1).padStart(2, '0')} {lesson.title}
            </button>
          ))}
        </div>

        {activeLesson && (
          <EditorWindow label={lessonFileName(activeLesson.title, activeIndex)}>
            <h2 className="font-display font-semibold text-white mb-4">{activeLesson.title}</h2>
            <div className="prose prose-invert prose-sm max-w-none prose-headings:font-display prose-headings:text-white prose-a:text-brand-sky prose-strong:text-white">
              <ReactMarkdown>{activeLesson.content_markdown}</ReactMarkdown>
            </div>
            <PrimaryButton onClick={() => markComplete(activeLesson.id)} className="mt-6">
              Mark Lesson Complete
            </PrimaryButton>
          </EditorWindow>
        )}
      </div>
    </div>
  )
}
