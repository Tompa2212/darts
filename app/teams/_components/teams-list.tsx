import { deleteTeam } from '@/actions/teams/delete-team';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { getUserTeams } from '@/data/teams';
import React from 'react';

type TeamsListProps = {
  teams: Awaited<ReturnType<typeof getUserTeams>>;
};

export const TeamsList = ({ teams }: TeamsListProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Teams</h3>
      <div className="flex flex-wrap gap-6">
        {teams.map((team) => (
          <Card
            key={team.name}
            className="[&>*]:px-3 flex flex-col flex-1 basis-[350px] md:max-w-md"
          >
            <CardHeader className="pt-2 pb-2 flex flex-row items-center justify-between">
              <h2 className="text-lg font-bold">{team.name}</h2>
              <form action={deleteTeam}>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`delete team ${team.name}`}
                  title={`delete team ${team.name}`}
                  name="teamId"
                  value={team.id}
                >
                  <Icon name="X" className="stroke-red-500" />
                </Button>
              </form>
            </CardHeader>
            <CardContent className="pt-0 pb-2 flex-1">
              <div className="flex flex-wrap gap-2">
                {team.players.map((p) => (
                  <Badge variant="secondary" key={p.name}>
                    {p.name} {p.user ? `(${p.user.email})` : null}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="py-2 pt-0">
              <span className="text-sm text-gray-500">
                {team.players.length} players
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeamsList;
