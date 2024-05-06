import NextAuth from 'next-auth';
import authConfig from '@/auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  if (!req.auth || !req.auth.user) {
    // If not signed in, send to login page
    const url = req.nextUrl.clone();
    url.pathname = '/api/auth/signin';
    return Response.redirect(url);
  }

  const { pathname } = req.nextUrl;
  const { isAdmin } = req.auth.user;

  // If root, send to respective dashboard
  if (pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = isAdmin ? '/admin' : '/hacker';
    return Response.redirect(url);
  }

  if (pathname.startsWith('/admin') && !isAdmin) {
    const url = req.nextUrl.clone();
    url.pathname = '/hacker';
    return Response.redirect(url);
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
