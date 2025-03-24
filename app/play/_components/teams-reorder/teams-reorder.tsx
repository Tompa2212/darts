import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';

import React from 'react';
import PlayersReorder from './players-reorder';
import { ConfigTeam, ConfigTeamPlayer } from '@/types/client/game-config';
import RenderIf from '@/components/render-if';
import { MoveDownIcon, MoveUpIcon } from 'lucide-react';

type TeamsReorderProps = {
  teams: ConfigTeam[];
  onReorder: (teams: ConfigTeam[]) => void;
};

function TeamsReorder({ teams, onReorder }: TeamsReorderProps) {
  function handleMoveUp(teamId: string) {
    const teamIdx = teams.findIndex((team) => team.id === teamId);

    if (teamIdx === 0 || teamIdx === -1) {
      return;
    }

    const newTeams = [...teams];
    const [removed] = newTeams.splice(teamIdx, 1);
    newTeams.splice(teamIdx - 1, 0, removed);

    onReorder(newTeams);
  }

  function handleMoveDown(teamId: string) {
    const teamIdx = teams.findIndex((team) => team.id === teamId);

    if (teamIdx === teams.length - 1 || teamIdx === -1) {
      return;
    }

    const newTeams = [...teams];
    const [removed] = newTeams.splice(teamIdx, 1);
    newTeams.splice(teamIdx + 1, 0, removed);

    onReorder(newTeams);
  }

  function handlePlayersReorder(teamId: string, players: ConfigTeamPlayer[]) {
    onReorder(
      teams.map((team) => {
        if (team.id === teamId) {
          return { ...team, players };
        }

        return team;
      })
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          disabled={!teams.length}
          type="button"
          variant="outline"
          size="sm"
        >
          Edit Order
        </Button>
      </DrawerTrigger>

      <DrawerContent className="p-4">
        <DrawerHeader className="px-0">
          <DrawerTitle className="text-lg font-semibold">
            Reorder Teams
          </DrawerTitle>
        </DrawerHeader>
        <ul className="space-y-4">
          {teams.map((team, idx) => {
            const canMoveUp = idx !== 0;
            const canMoveDown = idx !== teams.length - 1;
            const showPlayers = team.players.length > 1;

            return (
              <React.Fragment key={team.id}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-lg">{team.name}</span>
                  <div className="space-x-1">
                    <Button
                      onClick={() => handleMoveDown(team.id)}
                      disabled={!canMoveDown}
                      size="icon"
                      variant="ghost"
                    >
                      <MoveDownIcon className="h-4 w-4" name="MoveDown" />
                    </Button>
                    <Button
                      onClick={() => handleMoveUp(team.id)}
                      disabled={!canMoveUp}
                      size="icon"
                      variant="ghost"
                    >
                      <MoveUpIcon className="h-4 w-4" name="MoveUp" />
                    </Button>
                  </div>
                </div>
                <RenderIf condition={showPlayers}>
                  <PlayersReorder
                    players={team.players}
                    onPlayersReorder={(players) => {
                      handlePlayersReorder(team.id, players);
                    }}
                  />
                </RenderIf>
              </React.Fragment>
            );
          })}
        </ul>
      </DrawerContent>
    </Drawer>
  );
}

export default TeamsReorder;
