import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth.context'

export const useRoleRedirect = () => {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  const redirectBasedOnRole = (userRole: string) => {
    switch (userRole) {
      case 'admin':
        router.replace('/admin')
        break
      case 'user':
      default:
        router.replace('/')
        break
    }
  }

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      redirectBasedOnRole(user.role)
    }
  }, [isAuthenticated, isLoading, user, router])

  return { redirectBasedOnRole }
}