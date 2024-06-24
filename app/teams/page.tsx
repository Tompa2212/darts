import React, { Suspense } from 'react';
import { TeamsList, TeamsListSkeleton } from './_components/teams-list';
import { AddTeamForm } from './_components/add-team-form';
import { BackButton } from '@/components/back-button';
import protectedPage from '@/lib/protected-page';

export const metadata = {
  title: 'Manage Teams'
};

export default async function ManageTeamsPage() {
  await protectedPage();

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Manage Teams</h1>
        <BackButton />
      </div>
      <div className="mx-auto space-y-6">
        <AddTeamForm />
        <Suspense fallback={<TeamsListSkeleton />}>
          <TeamsList />
        </Suspense>
      </div>
    </div>
  );
}
