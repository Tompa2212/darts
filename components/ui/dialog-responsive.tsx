'use client';
import * as React from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger
} from '@/components/ui/drawer';
import { twMerge } from 'tailwind-merge';
import { useIsDesktop } from '@/hooks/use-is-desktop';

type DialogResponsiveProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
};

export function DialogResponsiveHeader({
  children,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isDesktop } = useDialogResponsiceContext();

  return isDesktop ? (
    <DialogHeader {...props}>{children}</DialogHeader>
  ) : (
    <DrawerHeader {...props}>{children}</DrawerHeader>
  );
}

export function DialogResponsiveFooter({
  children,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isDesktop } = useDialogResponsiceContext();

  return isDesktop ? (
    <DialogFooter {...props}>{children}</DialogFooter>
  ) : (
    <DrawerFooter {...props}>{children}</DrawerFooter>
  );
}

export function DialogResponsiveTrigger({
  children,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isDesktop } = useDialogResponsiceContext();

  return isDesktop ? (
    <DialogTrigger {...props}>{children}</DialogTrigger>
  ) : (
    <DrawerTrigger {...props}>{children}</DrawerTrigger>
  );
}

export function DialogResponsiveContent({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isDesktop } = useDialogResponsiceContext();

  return isDesktop ? (
    <DialogContent className={twMerge(className, 'flex max-h-[90vh] flex-col')}>
      {children}
    </DialogContent>
  ) : (
    <DrawerContent className={twMerge(className, 'max-h-[90vh] px-4')}>{children}</DrawerContent>
  );
}

type DialogResponsiveContextProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isDesktop: boolean;
};

export function DialogResponsive({ children, open, onOpenChange }: DialogResponsiveProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const isDesktop = useIsDesktop();

  return (
    <dialogResponsiveContext.Provider
      value={{
        open: open || isOpen,
        onOpenChange: onOpenChange || setIsOpen,
        isDesktop
      }}
    >
      {isDesktop ? (
        <Dialog open={open} onOpenChange={onOpenChange}>
          {children}
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={onOpenChange}>
          {children}
        </Drawer>
      )}
    </dialogResponsiveContext.Provider>
  );
}

const dialogResponsiveContext = React.createContext<DialogResponsiveContextProps | null>(null);

const useDialogResponsiceContext = () => {
  const context = React.useContext(dialogResponsiveContext);
  if (!context) {
    throw new Error('DialogResponsiveContext must be used within a DialogResponsiveProvider');
  }

  return context;
};
