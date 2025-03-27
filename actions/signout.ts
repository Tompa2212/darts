'use server';

import { lucia } from '@/auth';
import { validateRequest } from '@/lib/validate-request';
import { cookies } from 'next/headers';

export async function signout() {
  const { session } = await validateRequest();

  if (!session) {
    return {
      error: 'Unauthorized'
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}
