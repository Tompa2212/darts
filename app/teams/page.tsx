import { getUserTeams } from '@/data/teams';
import { getSessionUser } from '@/lib/auth';
import React from 'react';
import { EmptyTeamsView } from './_components/empty-teams-view';
import TeamsList from './_components/teams-list';
import { AddTeamForm } from './_components/add-team-form';
import { BackButton } from '@/components/back-button';

const ManageTeamsPage = async () => {
  const user = await getSessionUser();
  const userTeams = await getUserTeams(user?.id);

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Manage Teams</h1>
        <BackButton />
      </div>
      <div className="mx-auto space-y-6">
        <AddTeamForm />
        {userTeams ? <TeamsList teams={userTeams} /> : <EmptyTeamsView />}
      </div>
    </div>
  );
};

export default ManageTeamsPage;
