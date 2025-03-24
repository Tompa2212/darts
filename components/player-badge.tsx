import React from 'react';
import { Badge, BadgeProps } from './ui/badge';
import { UserPlayer } from '@/types/player';
import { BasePlayer } from '@/packages/cricket-game/types';
import { BadgeCheckIcon } from 'lucide-react';

type PlayerBadgeProps = {
  player: BasePlayer | UserPlayer;
} & BadgeProps;

const PlayerBadge = ({
  player,
  variant = 'secondary',
  ...badgeProps
}: PlayerBadgeProps) => {
  let isRegisteredUser: boolean = false;
  let playerName = player.name;

  if ('user' in player && player.user) {
    playerName = player.user.username;
  }

  if ('userId' in player && player.userId) {
    isRegisteredUser = true;
  }

  return (
    <Badge
      variant={variant}
      {...badgeProps}
      className="inline-flex items-center"
    >
      {playerName}{' '}
      {isRegisteredUser ? (
        <BadgeCheckIcon name="BadgeCheck" className="h-4 w-4 ml-2" />
      ) : null}
    </Badge>
  );
};

export default PlayerBadge;
