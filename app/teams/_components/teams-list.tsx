import { deleteTeam } from '@/actions/teams/delete-team';
import PlayerBadge from '@/components/player-badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
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
            key={team.name}
            className="*:px-3 flex flex-col flex-1 basis-[350px] md:max-w-md"
          >
            <CardHeader className="pt-2 pb-2 flex flex-row items-center justify-between">
              <h2 className="text-lg font-bold">{team.name}</h2>
              <form action={deleteTeam.bind(null, team.id)}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  title={`delete team ${team.name}`}
                >
                  <span className="sr-only">delete team ${team.name}</span>
                  <XIcon className="stroke-red-500 size-6" />
                </Button>
              </form>
            </CardHeader>
            <CardContent className="pt-0 pb-2 flex-1">
              {JSON.stringify(team.gameTeams, null, 2)}
              <p>{team.playedGames}</p>
              <div className="flex flex-wrap gap-2">
                {team.players.map((p) => (
                  <PlayerBadge key={p.userId || p.name} player={p} />
                ))}
              </div>
            </CardContent>
            <CardFooter className="py-2 pt-0">
              <span className="text-sm text-gray-500">
                {team.players.length}{' '}
                {`player${team.players.length > 1 ? 's' : ''}`}
              </span>
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
          <div
            key={i}
            className="flex-1 basis-[350px] flex flex-col space-y-3 md:max-w-md"
          >
            <Skeleton className="h-[155px] w-full rounded-xl" />
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
