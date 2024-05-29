import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  privateRoutes
} from '@/routes';
import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from './lib/validate-request';
import { verifyRequestOrigin } from 'lucia';

export default async function middleware(req: NextRequest) {
  const { session } = await validateRequest();
  const isLoggedIn = !!session;
  const { nextUrl } = req;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPrivateRoute = privateRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    return NextResponse.next();
  }

  if (!isLoggedIn && isPrivateRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  if (req.method === 'GET') {
    return NextResponse.next();
  }

  const originHeader = req.headers.get('Origin');
  // NOTE: You may need to use `X-Forwarded-Host` instead
  const hostHeader = req.headers.get('Host');
  if (
    !originHeader ||
    !hostHeader ||
    !verifyRequestOrigin(originHeader, [hostHeader])
  ) {
    return new NextResponse(null, {
      status: 403
    });
  }

  return NextResponse.next();
}

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
};
