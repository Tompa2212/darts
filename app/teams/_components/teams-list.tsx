import { deleteTeam } from '@/actions/teams/delete-team';
import PlayerBadge from '@/components/player-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserTeams } from '@/data/teams';
import { XIcon } from 'lucide-react';
import React from 'react';

export async function TeamsList() {
  const teams = await getUserTeams();

  return (
    <div>
      <Heading Type="h3" className="mb-2">
        Teams
      </Heading>
      <div className="flex flex-wrap gap-6">
        {teams.map((team) => (
          <Card
            key={team.id}
            className="flex flex-1 basis-[350px] flex-col shadow-md transition-shadow duration-200 *:px-4 hover:shadow-lg md:max-w-md"
          >
            <CardHeader className="flex flex-row items-center justify-between border-b pt-4 [.border-b]:pb-4">
              <h2 className="text-xl font-bold tracking-tight">{team.name}</h2>
              <form action={deleteTeam.bind(null, team.id)}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  title={`delete team ${team.name}`}
                  className="transition-colors hover:bg-red-100"
                >
                  <span className="sr-only">delete team {team.name}</span>
                  <XIcon className="size-5 stroke-red-500" />
                </Button>
              </form>
            </CardHeader>
            <CardContent className="flex-1 pt-3 pb-2">
              <div className="mb-3 flex flex-wrap gap-4 *:flex-1 *:basis-30">
                <div className="space-y-1 rounded-md bg-slate-100 px-3 py-1 text-center">
                  <p className="text-lg text-slate-500">Played</p>
                  <p className="text-xl font-semibold">{team.playedGames}</p>
                </div>
                <div className="space-y-1 rounded-md bg-green-50 px-3 py-1 text-center">
                  <p className="text-lg text-green-600">Won</p>
                  <p className="text-xl font-semibold text-green-700">{team.wonGames}</p>
                </div>
                {
                  <div className="space-y-1 rounded-md bg-blue-50 px-3 py-1 text-center">
                    <p className="text-lg text-blue-600">Win Rate</p>
                    <p className="text-xl font-semibold text-blue-700">
                      {team.playedGames > 0
                        ? Math.round((team.wonGames / team.playedGames) * 100)
                        : 0}
                      %
                    </p>
                  </div>
                }
              </div>
              <h3 className="mb-2 text-sm font-medium text-slate-500">Team Members</h3>
              <div className="flex flex-wrap gap-2">
                {team.members.map((p) => (
                  <PlayerBadge
                    className="rounded-2xl px-3 py-1.5"
                    key={p.userId || p.name}
                    player={p}
                  />
                ))}
              </div>
            </CardContent>
            <CardFooter className="mt-2 flex items-center justify-between border-t py-2 pt-0">
              <span className="text-sm text-gray-500">
                {team.members.length} {`player${team.members.length > 1 ? 's' : ''}`}
              </span>
              <Button variant="outline" size="sm" className="text-xs">
                View Team
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function TeamsListSkeleton() {
  return (
    <>
      <Heading Type="h3">Teams</Heading>
      <div className="flex flex-wrap gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-1 basis-[350px] flex-col space-y-3 md:max-w-md">
            <Skeleton className="h-[155px] w-full rounded-xl" />
            <div className="w-full space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
