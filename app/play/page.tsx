import { Heading } from '@/components/ui/heading';
import { GameSelector } from './game-selector';
import protectedPage from '@/lib/protected-page';

export const metadata = {
  title: 'Select Match'
};

export default async function PlayPage() {
  await protectedPage();

  return (
    <div className="container flex-1 space-y-4 py-4">
      <Heading Type="h2">New Match</Heading>
      <p>Choose a game to play. You can play cricket or 501.</p>
      <GameSelector />
    </div>
  );
}
