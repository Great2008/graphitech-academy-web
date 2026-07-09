import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { FormInput, PrimaryButton, ErrorMessage } from '../components/FormControls'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/courses')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-sky-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="text-xs tracking-[0.3em] text-brand-purple font-bold uppercase text-center mb-8">
          GraphiTech Academy
        </p>
        <h1 className="text-2xl font-extrabold text-brand-violet text-center mb-6">
          Welcome back
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6">
          <ErrorMessage message={error} />
          <FormInput
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <FormInput
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <PrimaryButton type="submit" loading={loading}>
            Log In
          </PrimaryButton>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          New here?{' '}
          <Link to="/signup" className="text-brand-purple font-semibold">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
