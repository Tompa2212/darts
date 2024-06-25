import { SessionUser } from '@/auth';
import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
  DrawerTitle
} from '../ui/drawer';
import { Icon } from '../ui/icon';
import { Button, buttonVariants } from '../ui/button';
import { Heading } from '../ui/heading';
import { Separator } from '../ui/separator';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { signout } from '@/actions/signout';
import { usePathname } from 'next/navigation';
import { DartIcon } from '../ui/icons/dart-icon';
import { BarChart3Icon, PlayIcon, UsersIcon } from 'lucide-react';
import Image from 'next/image';
import logo from '@/public/logo-no-background.svg';

const createLinkClasses = (pathname: string, href: string) => {
  const isActive = pathname.startsWith(href);

  return cn(
    buttonVariants({ variant: 'ghost', size: 'lg' }),
    'w-full text-left justify-start ps-2 w-[96%] rounded-e-2xl',
    {
      'bg-zinc-100': isActive
    }
  );
};

const mainLinks = [
  {
    href: '/play',
    icon: DartIcon,
    iconClass: 'fill-muted-foreground',
    text: 'Play Match'
  },
  {
    href: '/resume-match',
    icon: PlayIcon,
    text: 'Resume Match'
  },
  {
    href: '/teams',
    icon: UsersIcon,
    text: 'Manage Teams'
  },
  {
    href: '/profile',
    icon: UsersIcon,
    text: 'Profile'
  },
  {
    href: '/profile?activeTab=stats',
    icon: BarChart3Icon,
    text: 'Stats'
  }
];

export default function NavMobile() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <Drawer direction="left" open={open} onOpenChange={setOpen}>
      <DrawerTrigger>
        <Icon name="Menu" className="h-6 w-6" />
      </DrawerTrigger>
      <DrawerContent className="h-full w-[85%] rounded-none" hideDrawerHandle>
        <DrawerHeader className="text-left p-2">
          <DrawerTitle className="flex items-center justify-between">
            <Heading>
              <Image src={logo} alt="Bullseye Buddy logo" className="w-40" />
            </Heading>
            <Button
              variant="ghost"
              size="icon"
              className="flex items-center text-base"
              onClick={() => setOpen(false)}
            >
              <Icon name="X" className="w-8 h-8" />
            </Button>
          </DrawerTitle>
        </DrawerHeader>
        <div>
          <Separator />
          <ul className="flex flex-col gap-2 py-1">
            {mainLinks.map(({ icon: Icon, text, href, iconClass }) => (
              <Link
                key={href}
                href={href}
                className={createLinkClasses(pathname, href)}
                onClick={() => setOpen(false)}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 mr-2 stroke-muted-foreground',
                    iconClass
                  )}
                />
                {text}
              </Link>
            ))}
          </ul>
          <Separator />
          <ul className="flex flex-col gap-2 py-1">
            <Link
              href="/settings"
              className={createLinkClasses(pathname, '/settings')}
              onClick={() => setOpen(false)}
            >
              <Icon
                name="Settings"
                className="w-4 h-4 mr-2 stroke-muted-foreground"
              />
              Settings
            </Link>
            <Button
              variant="ghost"
              size="lg"
              className={createLinkClasses(pathname, '/signout')}
              onClick={() => {
                setOpen(false);
                signout();
              }}
            >
              <Icon
                name="LogOut"
                className="w-4 h-4 mr-2 stroke-muted-foreground"
              />
              Signout
            </Button>
          </ul>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
