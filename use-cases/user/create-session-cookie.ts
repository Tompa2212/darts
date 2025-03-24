import { lucia } from '@/auth';
import { User } from '@/types/user';
import { cookies } from 'next/headers';

export async function createAndAttachSessionCookie(user: User) {
  const session = await lucia.createSession(user.id, {
    name: user.name,
    username: user.username,
    email: user.email,
    image: user.image
  });

  const sessionCookie = lucia.createSessionCookie(session.id);

  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}
