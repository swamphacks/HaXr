import {
  clerkMiddleware,
  ClerkMiddlewareAuth,
  createRouteMatcher,
} from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/admin(.*)']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

const middlewareGetRole = (auth: ClerkMiddlewareAuth) =>
  auth().sessionClaims?.metadata.role;

export default clerkMiddleware((auth, req) => {
  // Ensure that user is signed in, if necessary
  if (isProtectedRoute(req)) auth().protect();

  // Ensure user is an admin, if necessary
  if (isAdminRoute(req) && middlewareGetRole(auth) !== 'admin') {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
