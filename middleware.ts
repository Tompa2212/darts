import { apiAuthPrefix, authRoutes, privateRoutes } from '@/routes';
import { StatusCodes } from 'http-status-codes';
import { verifyRequestOrigin } from 'lucia';
import { NextRequest, NextResponse } from 'next/server';

export const preferredRegion = ['fra1'];

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPrivateRoute = privateRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // const { session } = await validateRequest();
  // const isLoggedIn = !!session;

  // if (isAuthRoute) {
  //   if (isLoggedIn) {
  //     return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  //   }

  //   return NextResponse.next();
  // }

  // if (!isLoggedIn && isPrivateRoute) {
  //   let callbackUrl = nextUrl.pathname;
  //   if (nextUrl.search) {
  //     callbackUrl += nextUrl.search;
  //   }

  //   const encodedCallbackUrl = encodeURIComponent(callbackUrl);

  //   return NextResponse.redirect(
  //     new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
  //   );
  // }

  // if (req.method === 'GET') {
  //   return NextResponse.next();
  // }

  // const originHeader = req.headers.get('Origin');
  // // NOTE: You may need to use `X-Forwarded-Host` instead
  // const hostHeader = req.headers.get('Host');
  // if (
  //   !originHeader ||
  //   !hostHeader ||
  //   !verifyRequestOrigin(originHeader, [hostHeader])
  // ) {
  //   return new NextResponse(null, {
  //     status: StatusCodes.FORBIDDEN
  //   });
  // }

  return NextResponse.next();
}

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
};
