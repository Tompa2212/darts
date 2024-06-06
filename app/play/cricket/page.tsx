'use client';
import { useState } from 'react';
import { CricketGameConfig } from './_components/cricket-game-config';
import { CricketGame } from './_components/cricket-game';
import type { CricketGameConfig as GameConfig } from '@/types/client/cricket';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const SavedCricketGame = dynamic(
  () =>
    import('./_components/saved-cricket-game').then(
      (mod) => mod.SavedCricketGame
    ),
  {
    ssr: false,
    loading: () => <div>Loading...</div>
  }
);

const PlayCricketPage = () => {
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);

  const searchParams = useSearchParams();
  const gameId = searchParams.get('gameId');

  if (gameId) {
    return (
      <div className="flex-1 xl:container">
        <SavedCricketGame id={gameId} />
      </div>
    );
  }

  return (
    <div className="flex-1 xl:container">
      {gameConfig ? (
        <CricketGame
          teams={gameConfig.teams}
          useRandomNums={gameConfig.cricketNumbersOption === 'randomNums'}
          numbers={gameConfig.numbers}
          maxRounds={9999}
        />
      ) : (
        <CricketGameConfig onConfigured={setGameConfig} />
      )}
    </div>
  );
};

export default PlayCricketPage;
