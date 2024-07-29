import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Icon } from '@/components/ui/icon';
import { CrossedIcon } from '@/components/ui/icons/CrossedIcon';
import { cn } from '@/lib/utils';
import { CricketGameType } from '@/packages/cricket-game';
import { TriangleLeftIcon } from '@radix-ui/react-icons';

const getHitCountIcon = (count: number) => {
  if (count === 0) {
    return null;
  }

  if (count === 1) {
    return <Icon name="Slash" className="h-6 w-6 stroke-red-300" />;
  }

  if (count === 2) {
    return <CrossedIcon className="h-6 w-6 stroke-red-400 text-red-400" />;
  }

  return <Icon name="LocateFixed" className="h-6 w-6 stroke-red-600" />;
};

const getDiffToTeamWithMaxPoints = (game: CricketGameType) => {
  if (game.teams.length === 1) {
    return game.teams[0].points;
  }

  const teamsPointsSorted = game.teams.toSorted((a, b) => b.points - a.points);
  const currTeamPoints = game.currentTeam.points;
  const winningTeamPoints = teamsPointsSorted[0].points;

  if (winningTeamPoints === currTeamPoints) {
    const secondTeamPoints = teamsPointsSorted[1].points;
    return winningTeamPoints - secondTeamPoints;
  }

  return currTeamPoints - winningTeamPoints;
};

type ScoresTableProps = {
  game: CricketGameType;
};

export const ScoresTable = ({ game }: ScoresTableProps) => {
  const pointsDiff = getDiffToTeamWithMaxPoints(game);
  const currentTeam = game.currentTeam;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="p-0">Team</TableHead>
          {game.numbers.map((number) => (
            <TableHead className="w-0 p-0 text-center" key={number}>
              {number === 25 ? 'bull' : number}
            </TableHead>
          ))}
          <TableHead className="text-center">pts</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {game.teams.map((team) => {
          const isTeamPlaying = currentTeam.name === team.name;
          return (
            <TableRow key={team.name} className="h-12">
              <TableCell title={team.name} className="p-0 w-14 min-w-14">
                <div className="grid grid-cols-[1fr_auto] items-center p-0 sm:w-full">
                  <span
                    className={cn('text-overflow-ellipsis', {
                      'font-bold': isTeamPlaying
                    })}
                  >
                    {team.name}
                  </span>
                  {isTeamPlaying ? (
                    <TriangleLeftIcon className="w-4 h-4" />
                  ) : null}
                </div>
              </TableCell>
              {game.numbers.map((num) => (
                <TableCell
                  key={num}
                  className="w-10 min-w-10 text-center sm:min-w-20 p-0"
                >
                  <div className="grid max-w-full items-center justify-center">
                    {getHitCountIcon(team.hitCount[num])}
                  </div>
                </TableCell>
              ))}
              <TableCell className="w-18 text-right">{team.points}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      <TableFooter className="bg-transparent">
        <TableRow>
          <TableCell className="p-0 font-semibold">Round</TableCell>
          <TableCell>{game.currentRound}</TableCell>
          <TableCell className="p-0 font-semibold">Diff.</TableCell>
          <TableCell
            colSpan={8}
            className={cn(
              pointsDiff > 0 && 'text-green-500',
              pointsDiff < 0 && 'text-red-500'
            )}
          >
            {pointsDiff}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
