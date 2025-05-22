"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import toast from 'react-hot-toast'

interface User {
  _id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  role: string
  createdAt: string
  updatedAt: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Custom event to notify navbar of user changes
const dispatchUserUpdate = () => {
  window.dispatchEvent(new CustomEvent('userUpdated'))
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const storedToken = localStorage.getItem('kiddzy_token')
    const storedUser = localStorage.getItem('kiddzy_user')

    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse stored user data:', error)
        localStorage.removeItem('kiddzy_token')
        localStorage.removeItem('kiddzy_user')
        toast.error('Session expired. Please log in again.')
      }
    }
    
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      setUser(data.user)
      setToken(data.token)
      
      // Store in localStorage
      localStorage.setItem('kiddzy_token', data.token)
      localStorage.setItem('kiddzy_user', JSON.stringify(data.user))
      
      // Notify navbar of user update
      dispatchUserUpdate()
      
      // Show success toast
      toast.success(`Welcome back, ${data.user.firstName}!`)
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please try again.')
      throw error
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phoneNumber: userData.phone,
          password: userData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      setUser(data.user)
      setToken(data.token)
      
      // Store in localStorage
      localStorage.setItem('kiddzy_token', data.token)
      localStorage.setItem('kiddzy_user', JSON.stringify(data.user))
      
      // Notify navbar of user update
      dispatchUserUpdate()
      
      // Show success toast
      toast.success(`Welcome to Kiddzy, ${data.user.firstName}!`)
    } catch (error: any) {
      toast.error(error.message || 'Registration failed. Please try again.')
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('kiddzy_token')
    localStorage.removeItem('kiddzy_user')
    
    // Notify navbar of user update
    dispatchUserUpdate()
    
    // Show success toast
    toast.success('Logged out successfully')
  }

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}