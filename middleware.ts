import { auth } from '@/auth';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const NextRedirect = (req: NextRequest, url: string) => {
  const newUrl = req.nextUrl.clone();
  newUrl.pathname = url;
  return NextResponse.redirect(newUrl);
};

export default auth((req) => {
  // If not signed in then redirected to sign-in page
  if (!req.auth?.user) return NextRedirect(req, '/api/auth/signin');

  const { pathname } = req.nextUrl;
  const { role } = req.auth.user;

  // Redirect signed in at root to correct dashboard
  if (pathname == '/')
    return NextRedirect(req, role === Role.Admin ? '/admin' : '/hacker');

  // Protect admin dashboard
  if (pathname.startsWith('/admin') && role !== Role.Admin)
    return NextRedirect(req, '/');
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
