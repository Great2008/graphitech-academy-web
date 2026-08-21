import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { api } from '../lib/api'
import { useAuth } from '../lib/AuthContext'
import { EditorWindow } from '../components/EditorWindow'
import { PrimaryButton } from '../components/FormControls'
import { Loader } from '../components/Loader'

const PING_INTERVAL_SECONDS = 15

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

  // lessonId -> bool, populated as pings/quiz submissions respond during this session
  const [completedMap, setCompletedMap] = useState({})

  // Quiz state
  const [quiz, setQuiz] = useState(null)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizResult, setQuizResult] = useState(null)
  const [quizLoading, setQuizLoading] = useState(false)

  const pingIntervalRef = useRef(null)

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
      .catch(() => setEnrolled(false))
  }, [course, isAuthenticated])

  const activeLesson = course?.lessons?.[activeIndex]

  const sendPing = useCallback(
    async (seconds) => {
      if (!course || !activeLesson || !isAuthenticated) return
      try {
        const progress = await api.post(`/api/courses/${course.id}/progress`, {
          lesson_id: activeLesson.id,
          time_spent_seconds: seconds,
        })
        setCompletedMap((prev) => ({ ...prev, [activeLesson.id]: progress.is_completed }))
        if (progress.is_completed) refreshEnrollment()
      } catch {
        // silent — a missed ping just means slightly under-counted time, not worth surfacing
      }
    },
    [course, activeLesson, isAuthenticated]
  )

  // Time-ping loop: only meaningful for lessons without a quiz (quiz lessons
  // complete via passing the quiz instead), but harmless to run either way.
  useEffect(() => {
    if (pingIntervalRef.current) clearInterval(pingIntervalRef.current)
    if (!activeLesson || !isAuthenticated || completedMap[activeLesson.id]) return

    pingIntervalRef.current = setInterval(() => {
      sendPing(PING_INTERVAL_SECONDS)
    }, PING_INTERVAL_SECONDS * 1000)

    return () => clearInterval(pingIntervalRef.current)
  }, [activeLesson, isAuthenticated, completedMap, sendPing])

  // Load quiz when landing on a quiz lesson
  useEffect(() => {
    setQuiz(null)
    setQuizAnswers({})
    setQuizResult(null)
    if (!activeLesson?.has_quiz || !isAuthenticated) return
    setQuizLoading(true)
    api
      .get(`/api/lessons/${activeLesson.id}/quiz`)
      .then(setQuiz)
      .catch(() => {})
      .finally(() => setQuizLoading(false))
  }, [activeLesson, isAuthenticated])

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

  async function submitQuiz() {
    if (!quiz) return
    setQuizLoading(true)
    try {
      const result = await api.post(`/api/quizzes/${quiz.id}/attempt`, { quiz_id: quiz.id, answers: quizAnswers })
      setQuizResult(result)
      if (result.status === 'passed') {
        setCompletedMap((prev) => ({ ...prev, [activeLesson.id]: true }))
        refreshEnrollment()
      }
    } catch (err) {
      setActionMsg(err.message)
    } finally {
      setQuizLoading(false)
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

  if (loading) return <Loader />
  if (error) return <p className="text-center mt-20 text-brand-red font-mono text-sm">{error}</p>
  if (!course) return null

  const isLessonComplete = activeLesson && completedMap[activeLesson.id]

  return (
    <div className="min-h-[calc(100vh-73px-42px)] px-6 py-8">
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
              {completedMap[lesson.id] ? '✓ ' : ''}
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

            {activeLesson.has_quiz ? (
              <div className="mt-6 border-t border-white/10 pt-6">
                {quizLoading && !quiz && <p className="text-white/40 font-mono text-sm">loading quiz…</p>}
                {quiz && !quizResult && (
                  <>
                    <p className="font-display font-semibold text-white mb-4">{quiz.title}</p>
                    {quiz.questions.map((q, qi) => (
                      <div key={qi} className="mb-5">
                        <p className="text-white/80 text-sm mb-2">{qi + 1}. {q.question}</p>
                        <div className="space-y-1.5">
                          {q.options.map((opt, oi) => (
                            <label key={oi} className="flex items-center gap-2 text-sm text-white/60">
                              <input
                                type="radio"
                                name={`q${qi}`}
                                checked={quizAnswers[String(qi)] === oi}
                                onChange={() => setQuizAnswers({ ...quizAnswers, [String(qi)]: oi })}
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <PrimaryButton
                      onClick={submitQuiz}
                      loading={quizLoading}
                      disabled={Object.keys(quizAnswers).length < quiz.questions.length}
                    >
                      Submit Quiz
                    </PrimaryButton>
                  </>
                )}
                {quizResult && (
                  <div className={`rounded-lg p-4 ${quizResult.status === 'passed' ? 'bg-brand-green/10' : 'bg-brand-red/10'}`}>
                    <p className={`font-mono text-sm font-semibold mb-1 ${quizResult.status === 'passed' ? 'text-brand-green' : 'text-brand-red'}`}>
                      {quizResult.status === 'passed' ? '✓ Passed' : '✗ Not yet — try again'}
                    </p>
                    <p className="text-white/60 text-sm">Score: {quizResult.score_percent}%</p>
                    {quizResult.status !== 'passed' && (
                      <button
                        onClick={() => { setQuizResult(null); setQuizAnswers({}) }}
                        className="text-brand-sky font-mono text-xs mt-3"
                      >
                        retry
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p className="font-mono text-xs mt-6 pt-6 border-t border-white/10">
                {isLessonComplete ? (
                  <span className="text-brand-green">✓ completed</span>
                ) : (
                  <span className="text-white/30">reading… stays open to auto-complete</span>
                )}
              </p>
            )}
          </EditorWindow>
        )}
      </div>
    </div>
  )
}
