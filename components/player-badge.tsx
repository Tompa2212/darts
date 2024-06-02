import React from 'react';
import { Badge, BadgeProps } from './ui/badge';
import { UserPlayer } from '@/types/player';
import { BasePlayer } from '@/packages/cricket-game/types';
import { Icon } from './ui/icon';

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
    <Badge variant={variant} {...badgeProps} className="flex items-center">
      {player.name}{' '}
      {user ? <Icon name="BadgeCheck" className="h-4 w-4 ml-2" /> : null}
    </Badge>
  );
};

export default PlayerBadge;
