import { createContext, useContext, useState, useCallback } from 'react'
import { api } from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('gta_user')
    return stored ? JSON.parse(stored) : null
  })

  const persistSession = useCallback((token, userData) => {
    localStorage.setItem('gta_token', token)
    localStorage.setItem('gta_user', JSON.stringify(userData))
    setUser(userData)
  }, [])

  const login = useCallback(
    async (email, password) => {
      const data = await api.post('/api/auth/login', { email, password })
      persistSession(data.access_token, data.user)
      return data.user
    },
    [persistSession]
  )

  const signup = useCallback(
    async (username, email, password) => {
      const data = await api.post('/api/auth/signup', { username, email, password })
      persistSession(data.access_token, data.user)
      return data.user
    },
    [persistSession]
  )

  const logout = useCallback(() => {
    localStorage.removeItem('gta_token')
    localStorage.removeItem('gta_user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
