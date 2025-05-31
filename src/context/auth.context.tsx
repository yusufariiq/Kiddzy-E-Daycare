"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
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
  isLoading: boolean
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const storedToken = localStorage.getItem('kiddzy_token')
    const storedUser = localStorage.getItem('kiddzy_user')
  
    if (storedToken && storedUser) {
      try {
        const decoded = jwtDecode<DecodedToken>(storedToken)
        const now = Date.now() / 1000
  
        if (decoded.exp < now) {
          logout()
          toast.error("Session expired. Please log in again.")
        } else {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
  
          const timeout = (decoded.exp - now) * 1000
          const timer = setTimeout(() => {
            logout()
            toast.error("Session expired. Please log in again.")
          }, timeout)
  
          return () => clearTimeout(timer)
        }
      } catch (error) {
        logout()
        toast.error("Invalid session. Please log in again.")
      }
    }
  
    setIsLoading(false)
  }, [mounted])

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
      
      // Notify navbar of user update
      dispatchUserUpdate()
      
      // Show success toast
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
      // Use the correct endpoint that matches your API structure
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
        throw new Error(data.message || 'Failed to update profile')
      }
  
      // Map API response back to User type
      const updatedUser = {
        ...user,
        ...data.data,
        phone: data.data.phoneNumber,
        address: data.data.address,
      }
      
      setUser(updatedUser)
      
      // Update localStorage
      localStorage.setItem('kiddzy_user', JSON.stringify(updatedUser))
      
      // Notify components of user update
      dispatchUserUpdate()
      
      // Show success toast
      toast.success('Profile updated successfully!')
      
      return updatedUser
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile. Please try again.')
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
    updateUser,
    isAuthenticated: !!user && !!token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}