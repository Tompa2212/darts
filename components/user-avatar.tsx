import React from 'react';
import Image from 'next/image';
import { AvatarProps } from '@radix-ui/react-avatar';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Icon } from './ui/icon';
import { User } from '@/types/user';

type UserAvatarProps = {
  user: Pick<User, 'name' | 'image'>;
} & AvatarProps;

const UserAvatar = ({ user: { name, image }, ...props }: UserAvatarProps) => {
  return (
    <Avatar {...props}>
      {image ? (
        <div className="relative w-full h-full aspect-square">
          <Image
            fill
            src={image}
            alt="profile picture"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{name}</span>
          <Icon name="User" className="w-6 h-6" />
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
