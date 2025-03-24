import React from 'react';
import Image from 'next/image';
import { AvatarProps } from '@radix-ui/react-avatar';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { User } from '@/types/user';
import { UserIcon } from 'lucide-react';

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
          <UserIcon className="size-6" />
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
