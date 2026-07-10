import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { api } from '../lib/api'
import { useAuth } from '../lib/AuthContext'

export default function Tutor() {
  const { isAuthenticated } = useAuth()
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi — I'm your AI tutor. Ask me anything about your course." },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [remaining, setRemaining] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(e) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setError('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const res = await api.post('/api/tutor/chat', { message: userMessage })
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.reply,
          lowConfidence: res.low_confidence_flag,
          nudge: res.plagiarism_nudge,
        },
      ])
      setRemaining(res.remaining_free_requests_today)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6 text-center">
        <p className="text-white/40 font-mono text-sm">log in to chat with the AI tutor.</p>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-73px)] flex flex-col">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col px-4 pb-4">
        <p className="font-mono text-xs text-brand-amber text-center pt-4">$ ./ai-tutor</p>
        <h1 className="font-display font-bold text-lg text-white text-center py-2 mb-2">
          AI Tutor
        </h1>

        <div className="flex-1 overflow-y-auto space-y-3 mb-3">
          {messages.map((m, i) => (
            <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
              <div
                className={`inline-block max-w-[85%] rounded-2xl px-4 py-3 text-sm text-left ${
                  m.role === 'user'
                    ? 'bg-brand-purple text-white'
                    : 'bg-surface text-white/80 border border-white/5'
                }`}
              >
                {m.lowConfidence && (
                  <p className="text-xs text-brand-amber mb-1 font-mono">
                    ⚠ not fully confident about this one
                  </p>
                )}
                <div className="prose prose-invert prose-sm max-w-none prose-a:text-brand-sky">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
                {m.nudge && (
                  <p className="text-xs text-brand-purple mt-2 italic">{m.nudge}</p>
                )}
              </div>
            </div>
          ))}
          {loading && <p className="text-sm text-white/30 font-mono">thinking…</p>}
          {error && <p className="text-sm text-brand-red font-mono">{error}</p>}
          <div ref={bottomRef} />
        </div>

        {remaining !== null && (
          <p className="text-xs text-white/30 font-mono text-center mb-2">
            {remaining} free questions left today
          </p>
        )}

        <form onSubmit={sendMessage} className="flex gap-2">
          <div className="flex-1 flex items-center bg-surface border border-white/10 rounded-full px-4 focus-within:ring-2 focus-within:ring-brand-purple">
            <span className="font-mono text-brand-green text-sm mr-2">&gt;</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              className="flex-1 bg-transparent py-3 text-sm text-white placeholder-white/30 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-purple text-white rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
