import { getUserProfileData } from '@/data/user-profile';
import React, { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icon } from '@/components/ui/icon';
import { Heading } from '@/components/ui/heading';
import UserGamesList, { UserGamesListSkeleton } from './user-games';

export default async function ProfilePage({
  searchParams = {}
}: {
  params: { slug: string };
  searchParams?: { active?: string };
}) {
  const user = await getUserProfileData();
  const { active = 'games' } = searchParams;

  return (
    <main className="container py-4 space-y-6 max-w-6xl">
      <header>
        <Heading Type="h2" className="text-3xl mb-1">
          {user?.username}
        </Heading>
        <p className="text-muted-foreground text-lg">{user?.name}</p>
      </header>
      <Tabs defaultValue={active}>
        <TabsList>
          <TabsTrigger value="games">
            <span className="inline-block h-4 w-4 mr-1 leading-none">🎯</span>
            Games
          </TabsTrigger>
          <TabsTrigger value="stats">
            <Icon className="w-4 h-4 mr-1 stroke-green-600" name="BarChart3" />
            Stats
          </TabsTrigger>
        </TabsList>
        <TabsContent value="games">
          <Suspense fallback={<UserGamesListSkeleton />}>
            <UserGamesList />
          </Suspense>
        </TabsContent>
        <TabsContent value="stats">Stats.</TabsContent>
      </Tabs>
    </main>
  );
}
