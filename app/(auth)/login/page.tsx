import React, { Suspense } from 'react';
import { LoginForm } from '../_components/login-form';

type Props = {};

const LoginPage = (props: Props) => {
  return (
    <div>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
};

export default LoginPage;
