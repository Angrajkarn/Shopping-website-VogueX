import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define paths that require authentication
const PROTECTED_PATHS = [
    '/profile',
    '/checkout',
    '/orders',
]

// Define paths that are strictly for guests (redirect to home if logged in)
const AUTH_PATHS = [
    '/login',
    '/signup',
]

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Check for auth token in cookies
    const token = request.cookies.get('auth_token')?.value
    const isAuthenticated = !!token

    // 1. Protect Private Routes
    // Check if the current path starts with any of the protected paths
    const isProtectedPath = PROTECTED_PATHS.some(path => pathname.startsWith(path))

    if (isProtectedPath && !isAuthenticated) {
        // Redirect to login if trying to access protected route without auth
        const loginUrl = new URL('/login', request.url)
        // Store the original url to redirect back after login (optional, but good UX)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // 2. Redirect Authenticated Users away from Auth Pages
    // If user is already logged in, they shouldn't see login/signup pages
    const isAuthPath = AUTH_PATHS.some(path => pathname.startsWith(path))

    if (isAuthPath && isAuthenticated) {
        return NextResponse.redirect(new URL('/profile', request.url))
    }

    return NextResponse.next()
}

// Configure which paths the middleware runs on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder content
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
