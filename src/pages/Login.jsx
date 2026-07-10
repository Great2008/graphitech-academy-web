import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { EditorWindow } from '../components/EditorWindow'
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
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <EditorWindow label="login.sh">
          <p className="font-mono text-xs text-brand-green mb-4">$ ./login</p>
          <h1 className="font-display font-bold text-xl text-white mb-6">
            Welcome back
          </h1>

          <form onSubmit={handleSubmit}>
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

          <p className="text-center text-sm text-white/40 mt-6">
            New here?{' '}
            <Link to="/signup" className="text-brand-sky font-semibold">
              Create an account
            </Link>
          </p>
        </EditorWindow>
      </div>
    </div>
  )
}
