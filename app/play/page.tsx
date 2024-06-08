import { Heading } from '@/components/ui/heading';
import { GameSelector } from './game-selector';

export const metadata = {
  title: 'Select Match'
};

const PlayPage = () => {
  return (
    <div className="container flex-1 space-y-4 py-4">
      <Heading Type="h2">New Match</Heading>
      <p>Choose a game to play. You can play cricket or 501.</p>
      <GameSelector />
    </div>
  );
};

export default PlayPage;
