// middleware.ts
import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define protected routes (require authentication)
const protectedRoutes = [
  '/dashboard',
  '/dashboard/*',
  '/rsvp-management/events/check-in',
  '/rsvp-management/events/guest-list',
  '/rsvp-management/events/invitations',
  '/rsvp-management/events/reports',
  '/rsvp-management/events/thank-you',
];

// Define protected API routes (require authentication)
const protectedApiRoutes = [
  '/api/checkin',
  '/api/invitations',
  '/api/reports',
  '/api/thank-you',
  '/api/guests',
  '/api/guests/*',
];

// Define public routes (no authentication needed)
const publicRoutes = [
  '/',
  '/features',
  '/signin',
  '/signup', // Added to allow unauthenticated access to sign-up
  '/rsvp',
  '/rsvp/*',
  '/api/rsvp',
  '/api/rsvp/*',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log('Middleware triggered for:', pathname);

  // Get the session token using NextAuth.js
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production', // Use secure cookies in production
  });
  console.log('Token:', token ? { id: token.id, role: token.role } : 'No token');

  // Check if the route is public
  const isPublicRoute = publicRoutes.some((route) => {
    if (route === '/') {
      return pathname === '/'; // Exact match for root
    }
    const regex = new RegExp(`^${route.replace('*', '.*')}$`);
    return regex.test(pathname);
  });
  console.log('Is Public Route:', isPublicRoute);

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => {
    const regex = new RegExp(`^${route.replace('*', '.*')}$`);
    return regex.test(pathname);
  });
  const isProtectedApiRoute = protectedApiRoutes.some((route) => {
    const regex = new RegExp(`^${route.replace('*', '.*')}$`);
    return regex.test(pathname);
  });

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Handle protected routes (UI or API) with no token
  if ((isProtectedRoute || isProtectedApiRoute) && !token) {
    if (isProtectedApiRoute) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const loginUrl = new URL('/auth/signin', request.url);
    loginUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Check role for protected routes
  if (isProtectedRoute || isProtectedApiRoute) {
    const userRole = token?.role;
    console.log('User Role:', userRole);
    if (userRole !== 'admin') { // Changed from 'organizer' to 'admin'
      console.log('Invalid role, redirecting');
      if (isProtectedApiRoute) {
        return new NextResponse(
          JSON.stringify({ error: 'Forbidden: Admin role required' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return NextResponse.redirect(new URL('/rsvp', request.url)); // Redirect to /rsvp instead of /unauthorized
    }
  }

  console.log('Allowing request');
  return NextResponse.next();
}

// Configure matcher to apply middleware to specific routes
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};