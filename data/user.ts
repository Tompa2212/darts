import db from '@/db/drizzle';

export async function getUserByAuth0Id(auth0Id: string) {
  return (
    (await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.auth0Id, auth0Id)
    })) || null
  );
}

export async function getUserByUsername(username: string) {
  try {
    return await db.query.users.findFirst({
      where: (users, { eq, and }) => and(eq(users.status, 'active'), eq(users.username, username))
    });
  } catch (error) {
    return null;
  }
}

export async function searchUsersByUsername(search: string) {
  try {
    return await db.query.users.findMany({
      where: (users, { like, and, eq }) =>
        and(eq(users.status, 'active'), like(users.username, `${search}%`)),
      columns: {
        emailVerified: false
      }
    });
  } catch (error) {
    return [];
  }
}
