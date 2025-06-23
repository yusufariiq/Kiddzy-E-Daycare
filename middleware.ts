import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAuth, verifyAdmin } from '@/lib/middleware/auth.middleware'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected admin routes
  if (pathname.startsWith('/admin')) {
    const authResult = await verifyAdmin(request)
    
    if (!authResult.isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  // Protected user routes (if any)
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/profile')) {
    const authResult = await verifyAuth(request)
    
    if (!authResult.isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  // Prevent authenticated users from accessing auth pages
  if (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register')) {
    const authResult = await verifyAuth(request)
    
    if (authResult.isAuthenticated) {
      // Redirect based on role
      if (authResult.role === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/auth/:path*'
  ]
}