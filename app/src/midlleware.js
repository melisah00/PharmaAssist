
import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('access_token')?.value

  const publicPaths = ['/', '/login', '/register', '/api/login', '/api/register']

  if (publicPaths.includes(pathname) || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    if (token && (pathname === '/login' || pathname === '/register')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/settings/:path*']
}
