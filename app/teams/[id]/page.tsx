import { getTeamById } from '@/data/teams';
import { Heading } from '@/components/ui/heading';
import { notFound } from 'next/navigation';
import PlayerBadge from '@/components/player-badge';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeftIcon } from 'lucide-react';
import { TeamCricketStats } from './_components/team-cricket-stats';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import * as React from 'react';
import { StatsChart } from './_components/stats-chart';

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const team = await getTeamById(id);

  if (!team) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6">
      <Link href="/teams" className={cn(buttonVariants({ variant: 'ghost' }), 'mb-4 pr-4 pl-2')}>
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        Back to teams
      </Link>

      <header>
        <Heading Type="h2" className="mb-1 text-3xl">
          {team.name}
        </Heading>
        <p className="text-muted-foreground">Team details and statistics</p>
      </header>

      <Card className="shadow-md transition-shadow duration-200 hover:shadow-lg">
        <CardHeader className="border-b pt-4 sm:flex sm:items-center sm:gap-8 [.border-b]:pb-4">
          <Heading Type="h3" className="text-xl">
            Team Overview
          </Heading>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {team.members.map((member) => (
                <PlayerBadge
                  key={member.userId || member.name}
                  player={member}
                  className="rounded-2xl px-3 py-1.5"
                >
                  {member.name}
                </PlayerBadge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 pb-4 sm:grid sm:grid-cols-3 sm:gap-4">
          <StatsChart
            title="Overall"
            playedGames={team.playedGames || 0}
            wonGames={team.wonGames || 0}
          />
          <StatsChart
            title="Cricket"
            playedGames={team.playedGamesCricket || 0}
            wonGames={team.wonGamesCricket || 0}
          />
          <StatsChart
            title="Zero One"
            playedGames={team.playedGamesX01 || 0}
            wonGames={team.wonGamesX01 || 0}
          />
        </CardContent>
      </Card>

      <Suspense fallback={<div>Loading...</div>}>
        <TeamCricketStats teamId={id} />
      </Suspense>

      {/* Recent games section could be added here */}
    </main>
  );
}
