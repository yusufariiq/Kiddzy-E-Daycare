"use client"

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import toast from 'react-hot-toast'
import { User } from '@/lib/types/user' 
import { jwtDecode } from "jwt-decode"

interface DecodedToken {
  exp: number
  userId: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => Promise<void>
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

const TOKEN_KEY = 'kiddzy_token'
const USER_KEY = 'kiddzy_user'

const dispatchUserUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('userUpdated'))
  }
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
  const [isHydrated, setIsHydrated] = useState(false)

  const secureLogout = useCallback((showToast: boolean = true) => {
    setUser(null)
    setToken(null)
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      } catch (error) {
        console.error('Error clearing localStorage:', error)
      }
    }
    
    dispatchUserUpdate()
    
    if (showToast) {
      toast.success('Logged out successfully')
    }
  }, [])

  const setAuthenticationState = useCallback((tokenValue: string, userData: User) => {
    setToken(tokenValue)
    setUser(userData)
    dispatchUserUpdate()
  }, [])

  const isTokenValid = useCallback((tokenValue: string): boolean => {
    try {
      const decoded = jwtDecode<DecodedToken>(tokenValue)
      const now = Math.floor(Date.now() / 1000)
      const bufferTime = 60
      
      return decoded.exp > (now + bufferTime)
    } catch (error) {
      return false
    }
  }, [])

  // Synchronous initialization - no loading state
  const initializeAuth = useCallback(() => {
    if (!isHydrated) return

    try {
      const storedToken = localStorage.getItem(TOKEN_KEY)
      const storedUser = localStorage.getItem(USER_KEY)

      if (!storedToken || !storedUser) {
        return
      }

      if (!isTokenValid(storedToken)) {
        secureLogout(false)
        toast.error("Session expired. Please log in again.")
        return
      }

      let parsedUser: User
      try {
        parsedUser = JSON.parse(storedUser)
      } catch (parseError) {
        secureLogout(false)
        toast.error("Invalid session data. Please log in again.")
        return
      }

      setAuthenticationState(storedToken, parsedUser)

      // Set up automatic logout timer
      const decoded = jwtDecode<DecodedToken>(storedToken)
      const now = Math.floor(Date.now() / 1000)
      const timeUntilExpiry = (decoded.exp - now - 60) * 1000

      if (timeUntilExpiry > 0) {
        const timer = setTimeout(() => {
          secureLogout()
          toast.error("Session expired. Please log in again.")
        }, timeUntilExpiry)

        return () => clearTimeout(timer)
      }

    } catch (error) {
      secureLogout(false)
      toast.error("Authentication error. Please log in again.")
    }
  }, [isHydrated, isTokenValid, setAuthenticationState, secureLogout])

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    
    const cleanup = initializeAuth()
    return cleanup
  }, [isHydrated, initializeAuth])

  const secureStorage = {
    set: (key: string, value: string) => {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(key, value)
          return true
        } catch (error) {
          console.error(`Failed to store ${key}:`, error)
          return false
        }
      }
      return false
    }
  }

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

      if (!isTokenValid(data.token)) {
        throw new Error('Received invalid token from server')
      }

      const tokenStored = secureStorage.set(TOKEN_KEY, data.token)
      const userStored = secureStorage.set(USER_KEY, JSON.stringify(data.user))

      if (!tokenStored || !userStored) {
        throw new Error('Failed to store authentication data')
      }

      setAuthenticationState(data.token, data.user)
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

      if (!isTokenValid(data.token)) {
        throw new Error('Received invalid token from server')
      }

      const tokenStored = secureStorage.set(TOKEN_KEY, data.token)
      const userStored = secureStorage.set(USER_KEY, JSON.stringify(data.user))

      if (!tokenStored || !userStored) {
        throw new Error('Failed to store authentication data')
      }

      setAuthenticationState(data.token, data.user)
      toast.success(`Welcome to Kiddzy, ${data.user.firstName}!`)
      
    } catch (error: any) {
      toast.error(error.message || 'Registration failed. Please try again.')
      throw error
    }
  }

  const updateUser = async (userData: Partial<User>) => {
    if (!user || !token) {
      throw new Error('User not authenticated')
    }

    try {
      const response = await fetch(`/api/user/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          phoneNumber: userData.phoneNumber,
          email: userData.email,
          address: userData.address,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          secureLogout()
          toast.error("Session expired. Please log in again.")
          throw new Error('Session expired')
        }
        throw new Error(data.message || 'Failed to update profile')
      }

      const updatedUser = {
        ...user,
        ...data.data,
        phone: data.data.phoneNumber,
        address: data.data.address,
      }

      secureStorage.set(USER_KEY, JSON.stringify(updatedUser))
      setUser(updatedUser)
      dispatchUserUpdate()

      toast.success('Profile updated successfully!')
      return updatedUser
    } catch (error: any) {
      if (error.message !== 'Session expired') {
        toast.error(error.message || 'Failed to update profile. Please try again.')
      }
      throw error
    }
  }

  const logout = () => {
    secureLogout(true)
  }

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user && !!token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}