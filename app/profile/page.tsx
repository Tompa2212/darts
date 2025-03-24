import { getUserProfileData } from '@/data/user-profile';
import React, { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserGamesList, { UserGamesListSkeleton } from './user-games';
import { Heading } from '@/components/ui/heading';
import { ProfileTabs } from './profile-tabs';
import { BarChart3Icon } from 'lucide-react';

export default async function ProfilePage({
  searchParams
}: {
  params: { slug: string };
  searchParams: Promise<{ activeTab?: string }>;
}) {
  const user = await getUserProfileData();
  const { activeTab = 'games' } = await searchParams;

  return (
    <main className="container py-4 space-y-6 max-w-6xl">
      <header>
        <Heading Type="h2" className="text-3xl mb-1">
          {user?.username}
        </Heading>
        <p className="text-muted-foreground text-lg">{user?.name}</p>
      </header>
      <ProfileTabs defaultActive={activeTab}>
        <TabsList className="w-full sm:w-auto mb-2">
          <TabsTrigger value="games" className="flex-1">
            <span className="inline-block h-4 w-4 mr-1 leading-none">🎯</span>
            Games
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex-1">
            <BarChart3Icon
              className="w-4 h-4 mr-1 stroke-green-600"
              name="BarChart3"
            />
            Stats
          </TabsTrigger>
        </TabsList>
        <TabsContent value="games">
          <Suspense fallback={<UserGamesListSkeleton />}>
            <UserGamesList />
          </Suspense>
        </TabsContent>
        <TabsContent value="stats">Stats.</TabsContent>
      </ProfileTabs>
    </main>
  );
}
