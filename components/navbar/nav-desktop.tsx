import React from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import UserAvatar from './user-avatar';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SignOutMenuItem } from '../sign-out-menu-item';
import { SessionUser } from '@/auth';
import { BarChart3Icon, SettingsIcon, UserIcon } from 'lucide-react';

export default function NavDesktop({ user }: { user: SessionUser }) {
  return (
    <div className="flex items-center gap-4">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem className="bg-inherit">
            <NavigationMenuTrigger className="bg-inherit">
              Play
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="w-[300px]">
                <ListItem href="/play/cricket" title="Cricket">
                  Be the first player to close all the numbers and have most
                  points.
                </ListItem>
                <ListItem href="/play/zero-one" title="01">
                  Be the first player to reach 0 points.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/resume-match" legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(navigationMenuTriggerStyle(), 'bg-inherit')}
              >
                Resume Match
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/teams" legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(navigationMenuTriggerStyle(), 'bg-inherit')}
              >
                Manage Teams
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserAvatar user={user} className="w-8 h-8" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-full">
          <DropdownMenuItem asChild>
            <Link
              href="/profile"
              className="flex flex-col items-start! justify-start space-y-1 leading-none"
            >
              {user.username ? (
                <p className="font-medium text-base">{user.username}</p>
              ) : null}
              {user.email ? (
                <p className="leading-none w-[200px] truncate text-sm text-zinc-700">
                  {user.email}
                </p>
              ) : null}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <UserIcon name="User" className="w-4 h-4 mr-2" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile?activeTab=stats">
              <BarChart3Icon name="BarChart3" className="w-4 h-4 mr-2" />
              Stats
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <SettingsIcon name="Settings" className="w-4 h-4 mr-2" />
              Settings
            </Link>
          </DropdownMenuItem>
          <SignOutMenuItem />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<typeof Link>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
