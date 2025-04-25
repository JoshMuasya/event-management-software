// /middleware.ts
import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedRoutes = {
  admin: [
    '/admin',
    '/admin/*',
    '/rsvp-management/events/check-in',
    '/rsvp-management/events/guest-list',
    '/rsvp-management/events/invitations',
    '/rsvp-management/events/reports',
  ],
  organizer: [
    '/rsvp-management/events/check-in',
    '/rsvp-management/events/guest-list',
    '/rsvp-management/events/invitations',
  ],
  usher: [
    '/rsvp-management/events/check-in',
  ],
  user: [
    '/dashboard',
  ],
};

const protectedApiRoutes = {
  admin: ['/api/checkin', '/api/invitations', '/api/reports', '/api/guests', '/api/guests/*', '/api/set-role'],
  organizer: ['/api/checkin', '/api/invitations'],
  usher: ['/api/checkin'],
};

const publicRoutes = [
  '/',
  '/features',
  '/auth/signin',
  '/auth/signup',
  '/rsvp',
  '/rsvp/*',
  '/thank-you',
  '/api/rsvp',
  '/api/rsvp/*',
  '/auth/error',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log('Middleware: Processing request for:', pathname);

  // Allow all /api/auth/* routes to bypass middleware (NextAuth.js handles these)
  if (pathname.startsWith('/api/auth')) {
    console.log('Middleware: Bypassing /api/auth/* route');
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production',
  });
  console.log('Middleware: Token:', token ? { id: token.id, role: token.role } : 'No token');

  const isPublicRoute = publicRoutes.some((route) => {
    if (route === '/') {
      return pathname === '/';
    }
    const regex = new RegExp(`^${route.replace('*', '.*')}$`);
    return regex.test(pathname);
  });
  console.log('Middleware: Is Public Route:', isPublicRoute);

  if (isPublicRoute) {
    console.log('Middleware: Allowing public route');
    return NextResponse.next();
  }

  if (!token) {
    console.log('Middleware: No token, redirecting to sign-in');
    const loginUrl = new URL('/auth/signin', request.url);
    loginUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(loginUrl);
  }

  const userRole = token.role;
  console.log('Middleware: User Role:', userRole);

  const isProtectedRoute = Object.entries(protectedRoutes).some(([role, routes]) =>
    routes.some((route) => {
      const regex = new RegExp(`^${route.replace('*', '.*')}$`);
      return regex.test(pathname) && userRole === role;
    })
  );

  const isProtectedApiRoute = Object.entries(protectedApiRoutes).some(([role, routes]) =>
    routes.some((route) => {
      const regex = new RegExp(`^${route.replace('*', '.*')}$`);
      return regex.test(pathname) && userRole === role;
    })
  );

  if (!isProtectedRoute && !isProtectedApiRoute) {
    console.log('Middleware: Invalid role, redirecting to /dashboard');
    if (pathname.startsWith('/api')) {
      return new NextResponse(
        JSON.stringify({ error: 'Forbidden: Insufficient role' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  console.log('Middleware: Allowing request');
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
};