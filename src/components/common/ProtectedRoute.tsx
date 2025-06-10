'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth.context'
import LoadingSpinner from '@/components/ui/loading-spinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'user'
  fallbackPath?: string
}

export default function ProtectedRoute({ 
  children, 
  requiredRole,
  fallbackPath = '/auth/login' 
}: ProtectedRouteProps) {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated || !user) {
      router.replace(fallbackPath)
      return
    }

    if (requiredRole && user.role !== requiredRole) {
      if (user.role === 'admin') {
        router.replace('/admin')
      } else {
        router.replace('/')
      }
      return
    }

    setIsAuthorized(true)
  }, [isAuthenticated, user, isLoading, requiredRole, router, fallbackPath])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" className='text-[#FE7743]' />
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}