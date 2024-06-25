import { NextRequest, NextResponse } from 'next/server';

export const preferredRegion = ['fra1'];

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  return NextResponse.next();
}

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
};
