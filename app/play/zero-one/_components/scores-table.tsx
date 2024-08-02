import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { ZeroOneGameType } from '@/packages/zero-one';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TeamsOutshotCombinations } from '@/packages/zero-one/types';

type ScoresTableProps = {
  game: ZeroOneGameType;
  teamsOutshotCombinations: TeamsOutshotCombinations;
};

export default function ScoresTable({
  game,
  teamsOutshotCombinations
}: ScoresTableProps) {
  const showSets = game.sets > 1;
  const showLegs = game.legs > 1;

  return (
    <div>
      <Table>
        <TableHeader>
          <TableHead>Team</TableHead>
          {showSets && <TableHead>Sets</TableHead>}
          {showLegs && <TableHead>Legs</TableHead>}
          <TableHead>Points</TableHead>
        </TableHeader>

        <TableBody>
          {game.teams.map((team) => (
            <TableRow key={team.id}>
              <TableCell className="font-semibold">{team.name}</TableCell>
              {showSets && <TableCell>{team.sets}</TableCell>}
              {showLegs && <TableCell>{team.legs}</TableCell>}
              <TableCell>{team.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
