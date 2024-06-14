'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { SlashIcon } from '@radix-ui/react-icons';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { inter } from '@/app/fonts';

const createBreadcrumbHref = (paths: string[], pathIdx: number) => {
  return `/${paths.slice(0, pathIdx + 1).join('/')}`;
};

export const NavbarBreadcrumbs = () => {
  const pathName = usePathname();
  const pathList = [
    ...pathName
      .split('/')
      .filter((path) => path !== '')
      .map((p, idx, arr) => ({
        label: p.split('-').join(' '),
        href: createBreadcrumbHref(arr, idx)
      }))
  ];
  const last = pathList.pop();

  return (
    <Breadcrumb>
      <BreadcrumbList className={inter.className}>
        {pathList.map((path) => {
          return (
            <React.Fragment key={path.label}>
              <BreadcrumbItem>
                <BreadcrumbLink
                  asChild
                  className="capitalize sm:text-lg italic"
                >
                  <Link href={path.href}>{path.label}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <SlashIcon />
              </BreadcrumbSeparator>
            </React.Fragment>
          );
        })}
        <BreadcrumbPage className="capitalize sm:text-lg font-bold italic">
          {last?.label}
        </BreadcrumbPage>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
