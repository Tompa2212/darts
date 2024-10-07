import db from '@/db/drizzle';

export const getUserByEmail = async (email: string) => {
  try {
    return await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email)
    });
  } catch (error) {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    return await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id)
    });
  } catch (error) {
    return null;
  }
};

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
      where: (users, { eq }) => eq(users.username, username)
    });
  } catch (error) {
    return null;
  }
}

export async function searchUsersByUsername(search: string) {
  try {
    return await db.query.users.findMany({
      where: (users, { like }) => like(users.username, search + '%'),
      columns: {
        emailVerified: false
      }
    });
  } catch (error) {
    return [];
  }
}
