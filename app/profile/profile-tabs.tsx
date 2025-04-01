'use client';

import { Tabs } from '@/components/ui/tabs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function ProfileTabs({
  defaultActive,
  children
}: {
  defaultActive: string;
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleValueChange(value: string) {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set('activeTab', value);
    } else {
      params.delete('activeTab');
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Tabs defaultValue={defaultActive} onValueChange={handleValueChange} orientation="vertical">
      {children}
    </Tabs>
  );
}
