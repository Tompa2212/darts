import Link from 'next/link';

import { Heading } from '@/components/ui/heading';
import { ChangeUsernameForm } from './change-username-form';
import { getUser } from '@/lib/auth';

export default async function SettingsPage() {
  const user = await getUser();

  return (
    <main className="flex flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <Heading>Settings</Heading>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav
          className="grid gap-4 text-sm text-muted-foreground"
          x-chunk="dashboard-04-chunk-0"
        >
          <Link href="#" className="font-semibold text-primary">
            General
          </Link>
        </nav>
        <div className="grid gap-6">
          {user && <ChangeUsernameForm user={user} />}
        </div>
      </div>
    </main>
  );
}
