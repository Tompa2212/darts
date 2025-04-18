import React, { Suspense } from 'react';
import { LoginForm } from '../_components/login-form';
import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const user = await getUser();

  if (user) {
    return redirect('/');
  }

  return (
    <div className="bg-background-light flex items-start justify-center pt-10 sm:pt-20">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="text-text-light-primary mb-2 text-2xl font-bold">Welcome to Darts App</h1>
          <p className="text-text-light-secondary">
            Sign in to start playing and tracking your games
          </p>
        </div>

        <div className="rounded-xl bg-white sm:p-6 sm:shadow-[0_2px_8px_rgba(0,0,0,0.05)] lg:p-8">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
