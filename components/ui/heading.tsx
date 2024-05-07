import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';
import { cn } from '@/lib/utils';

type HeadingProps = {
  Type?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
} & React.HTMLAttributes<HTMLHeadingElement>;

const headingVariants = cva('font-semibold', {
  variants: {
    Type: {
      h1: 'text-xl sm:text-2xl',
      h2: 'text-xl',
      h3: 'text-lg',
      h4: 'text-base',
      h5: 'text-sm',
      h6: 'text-xs'
    }
  },
  defaultVariants: {
    Type: 'h1'
  }
});

export const Heading = ({
  children,
  Type = 'h1',
  className,
  ...rest
}: HeadingProps) => {
  return (
    <Type
      className={twMerge(cn(headingVariants({ Type })), className)}
      {...rest}
    >
      {children}
    </Type>
  );
};
