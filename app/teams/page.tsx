import React, { Suspense } from 'react';
import { TeamsList, TeamsListSkeleton } from './_components/teams-list';
import { AddTeamForm } from './_components/add-team-form';
import { BackButton } from '@/components/back-button';
import { getUser } from '@/lib/auth';

export default async function ManageTeamsPage() {
  const user = await getUser();

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Manage Teams</h1>
        <BackButton />
      </div>
      <div className="mx-auto space-y-6">
        <AddTeamForm user={user} />
        <Suspense fallback={<TeamsListSkeleton />}>
          <TeamsList />
        </Suspense>
      </div>
    </div>
  );
}
