import { google } from '@/auth';
import { generateCodeVerifier, generateState } from 'arctic';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ['openid', 'email', 'profile']
  });

  (await cookies()).set('google_oauth_state', state, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax'
  });

  (await cookies()).set('google_code_verifier', codeVerifier, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax'
  });

  const searchParams = req.nextUrl.searchParams;
  const callbackUrl = searchParams.get('callback_url');

  if (callbackUrl) {
    // only allow relative URLs
    const validCallbackUrl = callbackUrl.startsWith('/') && !callbackUrl.includes('..');

    if (validCallbackUrl) {
      (await cookies()).set('app_callback_url', callbackUrl, {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: 'lax'
      });
    }
  }

  return Response.redirect(url);
}
