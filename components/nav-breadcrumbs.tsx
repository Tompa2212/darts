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

const createBreadcrumbHref = (paths: string[], pathIdx: number) => {
  return `/${paths.slice(0, pathIdx + 1).join('/')}`;
};

export const NavbarBreadcrumbs = () => {
  const pathName = usePathname();
  const pathList = [
    { label: 'home', href: '/' },
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
      <BreadcrumbList>
        {pathList.map((path) => {
          return (
            <React.Fragment key={path.label}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild className="capitalize text-base">
                  <Link href={path.href}>{path.label}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <SlashIcon />
              </BreadcrumbSeparator>
            </React.Fragment>
          );
        })}
        <BreadcrumbPage className="capitalize text-base">
          {last?.label}
        </BreadcrumbPage>
      </BreadcrumbList>
    </Breadcrumb>
  );
};