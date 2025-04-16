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
  });
  console.log('Token:', token);

  // Check if the route is public
  const isPublicRoute = publicRoutes.some((route) => {
    if (route === '/') {
      return pathname === '/'; // Exact match for root
    }
    const regex = new RegExp(`^${route.replace('*', '.*')}$`);
    return regex.test(pathname);
  });
  console.log('Is Public Route:', isPublicRoute);
  if (isPublicRoute) {
    console.log('Matched Public Route:', publicRoutes.find((route) => {
      if (route === '/') {
        return pathname === '/';
      }
      const regex = new RegExp(`^${route.replace('*', '.*')}$`);
      return regex.test(pathname);
    }));
  }

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => {
    const regex = new RegExp(`^${route.replace('*', '.*')}$`);
    return regex.test(pathname);
  });
  const isProtectedApiRoute = protectedApiRoutes.some((route) => {
    const regex = new RegExp(`^${route.replace('*', '.*')}$`);
    return regex.test(pathname);
  });
  console.log('Is Protected Route:', isProtectedRoute);
  console.log('Is Protected API Route:', isProtectedApiRoute);

  // If the route is public, allow access
  if (isPublicRoute) {
    console.log('Allowing public route');
    return NextResponse.next();
  }

  // If the route is protected (UI or API) and no token exists, redirect or return error
  if ((isProtectedRoute || isProtectedApiRoute) && !token) {
    console.log('No token, redirecting');
    if (isProtectedApiRoute) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    // Redirect to custom sign-in page
    const loginUrl = new URL('/signin', request.url);
    loginUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // For authenticated users, check role (e.g., organizer) for admin routes
  if (isProtectedRoute || isProtectedApiRoute) {
    const userRole = token?.role;
    console.log('User Role:', userRole);
    if (userRole !== 'organizer') {
      if (isProtectedApiRoute) {
        return new NextResponse(
          JSON.stringify({ error: 'Forbidden: Organizer role required' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  console.log('Allowing request');
  return NextResponse.next();
}

// Configure matcher to apply middleware to specific routes
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};