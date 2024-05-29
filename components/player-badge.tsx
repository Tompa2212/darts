import React from 'react';
import { Badge, BadgeProps } from './ui/badge';
import { UserPlayer } from '@/types/player';
import { BasePlayer } from '@/packages/cricket-game/types';

type PlayerBadgeProps = {
  player: BasePlayer | UserPlayer;
} & BadgeProps;

const PlayerBadge = ({
  player,
  variant = 'secondary',
  ...badgeProps
}: PlayerBadgeProps) => {
  let user: UserPlayer['user'] | null = null;

  if ('user' in player) {
    user = player.user;
  }

  return (
    <Badge variant={variant} {...badgeProps}>
      {player.name} {user ? `(${user.email})` : null}
    </Badge>
  );
};

export default PlayerBadge;
