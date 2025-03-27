import React, { Suspense } from 'react';
import { LoginForm } from '../_components/login-form';
import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function LoginPage() {
  const user = await getUser();

  if (user) {
    return redirect('/');
  }

  return (
    <div className="bg-background-light flex items-start justify-center pt-10 sm:pt-20">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-light-primary mb-2">
            Welcome to Darts App
          </h1>
          <p className="text-text-light-secondary">
            Sign in to start playing and tracking your games
          </p>
        </div>

        <div className="bg-white sm:p-6 lg:p-8 rounded-xl sm:shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
