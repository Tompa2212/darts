import { google } from '@/auth';

import { cookies } from 'next/headers';
import { GoogleTokens, OAuth2RequestError } from 'arctic';
import { registerUser } from '@/use-cases/user/register-user';
import { createAndAttachSessionCookie } from '@/use-cases/user/create-session-cookie';
import { getUserByAuth0Id } from '@/data/user';
import { StatusCodes } from 'http-status-codes';

async function cleanGoogleCookies() {
  const c = await cookies();
  c.delete('google_oauth_state');
  c.delete('google_code_verifier');
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const c = await cookies();
  const codeVerifier = c.get('google_code_verifier')?.value ?? null;
  const storedState = c.get('google_oauth_state')?.value ?? null;

  cleanGoogleCookies();

  if (
    !code ||
    !state ||
    !storedState ||
    !codeVerifier ||
    state !== storedState
  ) {
    return new Response(null, {
      status: StatusCodes.BAD_REQUEST
    });
  }

  try {
    const tokens: GoogleTokens = await google.validateAuthorizationCode(
      code,
      codeVerifier
    );

    const response = await fetch(
      'https://openidconnect.googleapis.com/v1/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`
        }
      }
    );

    if (!response.ok) {
      return new Response(null, {
        status: StatusCodes.BAD_REQUEST
      });
    }

    const data = (await response.json()) as GoogleUserInfo;

    const { sub, email, name, email_verified, picture } = data;

    const existingUser = await getUserByAuth0Id(sub);

    if (existingUser) {
      await createAndAttachSessionCookie(existingUser);

      return new Response(null, {
        status: 302,
        headers: {
          Location: '/'
        }
      });
    }

    const user = await registerUser({
      auth0Id: sub,
      email,
      name,
      image: picture || null,
      emailVerified: email_verified ? new Date() : null
    });

    await createAndAttachSessionCookie(user);

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/'
      }
    });
  } catch (e) {
    console.log(e);
    if (
      e instanceof OAuth2RequestError &&
      e.message === 'bad_verification_code'
    ) {
      // invalid code
      return new Response(null, {
        status: StatusCodes.BAD_REQUEST
      });
    }
    return new Response(null, {
      status: StatusCodes.INTERNAL_SERVER_ERROR
    });
  }
}

type GoogleUserInfo = {
  sub: string;
  email: string;
  name: string;
  family_name: string;
  given_name: string;
  email_verified: boolean;
  picture: string;
  locale: string;
};
