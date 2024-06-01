import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { NextRequest } from 'next/server';
import { Role } from '@prisma/client';

const { auth } = NextAuth(authConfig);

const RedirectResponse = (req: NextRequest, pathname: string) => {
  const newUrl = req.nextUrl.clone();
  newUrl.pathname = pathname;
  return Response.redirect(newUrl);
};

export default auth((req) => {
  /* Authentication & Authorization */

  // If not signed in, send to login page
  if (!req.auth || !req.auth.user)
    return RedirectResponse(req, '/api/auth/signin');

  const { pathname } = req.nextUrl;
  const isAdmin = req.auth.user.role === Role.Admin;

  // Redirect if accessing unauthorized pages
  if (pathname.startsWith('/admin') && !isAdmin)
    return RedirectResponse(req, '/hacker');

  /* Redirects */

  // If root, send to respective dashboard
  if (pathname === '/')
    return RedirectResponse(req, isAdmin ? '/admin/comp' : '/hacker');

  // If admin root, send to admin competition dashboard
  if (pathname === '/admin') return RedirectResponse(req, '/admin/comp');
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
