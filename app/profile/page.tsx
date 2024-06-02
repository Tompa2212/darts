import { getUserProfileData } from '@/data/user-profile';
import React from 'react';

export default async function ProfilePage() {
  const user = await getUserProfileData();

  return (
    <div className="container">
      <pre className="max-w-full overflow-auto">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}
