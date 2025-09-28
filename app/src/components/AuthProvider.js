'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import api from '@/lib/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await api.get('/me')
      setUser(res.data)
      document.cookie = `user_role=${res.data.role}; path=/; max-age=86400`
      return res.data
    } catch (error) {
      if (error.response?.status === 401) {
        setUser(null) // korisnik nije prijavljen
      } else {
        console.error('Failed to fetch user:', error)
      }
      return null
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    try {
      await api.post('/login', { username, password })
      const userData = await fetchUser()
      if (!userData) throw new Error('Failed to fetch user')
      return { success: true, user: userData }
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Login failed' }
    }
  }

  const register = async (userData) => {
    try {
      const res = await api.post('/register', userData)
      setUser(res.data)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Registration failed' }
    }
  }

  const logout = async () => {
    try { await api.post('/logout') } catch {}
    setUser(null)
    document.cookie = 'user_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser, refreshUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
