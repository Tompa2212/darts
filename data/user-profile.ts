import db from '@/db/drizzle';
import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function getUserProfileData() {
  const sessionUser = await getUser();

  if (!sessionUser) {
    redirect('/login');
  }

  return db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, sessionUser.id),
    columns: {
      emailVerified: false,
      auth0Id: false
    }
  });
}
