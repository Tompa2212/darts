import React, { Suspense } from 'react';
import { LoginForm } from '../_components/login-form';
import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

type Props = {};

export default async function LoginPage(props: Props) {
  const user = await getUser();

  if (user) {
    return redirect('/');
  }

  return (
    <div>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
