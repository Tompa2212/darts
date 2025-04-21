import { getUserProfileData } from '@/data/user-profile';
import React, { Suspense } from 'react';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserGamesList, { UserGamesListSkeleton } from './user-games';
import { Heading } from '@/components/ui/heading';
import { ProfileTabs } from './profile-tabs';
import { BarChart3Icon } from 'lucide-react';

export default async function ProfilePage({
  searchParams
}: {
  searchParams: Promise<{ activeTab?: string }>;
}) {
  const user = await getUserProfileData();
  const { activeTab = 'games' } = await searchParams;

  return (
    <main className="container max-w-6xl space-y-6 py-4">
      <header>
        <Heading Type="h2" className="mb-1 text-3xl">
          {user?.username}
        </Heading>
        <p className="text-muted-foreground text-lg">{user?.name}</p>
      </header>
      <ProfileTabs defaultActive={activeTab}>
        <TabsList className="mb-2 w-full sm:w-auto">
          <TabsTrigger value="games" className="flex-1">
            <span className="mr-1 inline-block h-4 w-4 leading-none">🎯</span>
            Games
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex-1">
            <BarChart3Icon className="mr-1 h-4 w-4 stroke-green-600" name="BarChart3" />
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
