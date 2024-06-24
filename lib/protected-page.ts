import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import 'server-only';

export default async function protectedPage() {
  const user = await getUser();

  if (!user) {
    return redirect('/login');
  }

  return user;
}
