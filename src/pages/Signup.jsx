import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { EditorWindow } from '../components/EditorWindow'
import { FormInput, PrimaryButton, ErrorMessage } from '../components/FormControls'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signup(username, email, password)
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
        <EditorWindow label="signup.sh">
          <p className="font-mono text-xs text-brand-green mb-4">$ ./create-account</p>
          <h1 className="font-display font-bold text-xl text-white mb-6">
            Start learning for free
          </h1>

          <form onSubmit={handleSubmit}>
            <ErrorMessage message={error} />
            <FormInput
              label="Username"
              type="text"
              required
              minLength={3}
              pattern="[a-zA-Z0-9_]+"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="yourname"
            />
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
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
            />
            <PrimaryButton type="submit" loading={loading}>
              Create Account
            </PrimaryButton>
          </form>

          <p className="text-center text-sm text-white/40 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-sky font-semibold">
              Log in
            </Link>
          </p>
        </EditorWindow>
      </div>
    </div>
  )
}
