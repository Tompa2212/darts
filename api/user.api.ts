export async function fetchCurrentUser() {
  const res = await fetch('/api/session');

  if (!res.ok) {
    throw new Error('Unauthorized');
  }

  const user = await res.json();
  return user;
}
