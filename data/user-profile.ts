import db from '@/db/drizzle';
import { getUser } from '@/lib/auth';

export async function getUserProfileData() {
  const sessionUser = await getUser();

  if (!sessionUser) {
    throw new Error('Unauthorized');
  }

  return db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, sessionUser.id),
    columns: {
      emailVerified: false,
      auth0Id: false
    }
  });
}
