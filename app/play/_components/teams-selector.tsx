import { MultiSelect } from '@/components/ui/multiselect';
import React from 'react';
import { useUserTeams } from '../use-user-teams';
import { UserTeams } from '@/types/team';
import { ConfigTeams } from '@/schema/games-config.schema';

type TeamsSelectorProps = {
  className?: string;
  placeholder?: string;
  onChange: (selected: ConfigTeams) => void;
  value: ConfigTeams;
};

export function TeamsSelector({
  onChange,
  value,
  ...rest
}: TeamsSelectorProps) {
  const allTeams = useUserTeams();

  return (
    <MultiSelect
      selected={value.map((team) => team.name)}
      options={allTeams.map((team) => ({
        value: team.name,
        label: `${team.name} - (${team.players
          .map((p) => p?.user?.username ?? p.name)
          .join(', ')})`
      }))}
      onChange={(value) => {
        const newSelectedTeams = value
          .map((teamName) => allTeams.find((t) => t.name === teamName))
          .filter(Boolean) as UserTeams[];

        onChange(newSelectedTeams);
      }}
      {...rest}
      className="sm:w-[510px]"
    />
  );
}
