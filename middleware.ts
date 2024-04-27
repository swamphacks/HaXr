import {
  clerkMiddleware,
  ClerkMiddlewareAuth,
  createRouteMatcher,
} from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/hacker(.*)', '/admin(.*)']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

const middlewareGetRole = (auth: ClerkMiddlewareAuth) =>
  auth().sessionClaims?.metadata.role;

export default clerkMiddleware((auth, req) => {
  const url = req.nextUrl.clone();

  // Ensure that user is signed in, if necessary
  if (isProtectedRoute(req)) auth().protect();

  // Root redirects to dashboard corresponding to user's role
  if (url.pathname === '/') {
    url.pathname = middlewareGetRole(auth) === 'admin' ? '/admin' : '/hacker';
    return NextResponse.redirect(url);
  }

  // Ensure user is an admin, if necessary
  if (isAdminRoute(req) && middlewareGetRole(auth) !== 'admin') {
    // Redirect to applicant dashboard
    url.pathname = '/hacker';
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
