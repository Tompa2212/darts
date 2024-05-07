'use client';

import { useState } from 'react';
import { CricketGameConfig } from './_components/cricket-game-config';
import * as z from 'zod';
import { cricketConfigSchema } from '@/schema/cricket-config.schema';
import { CricketGame } from './_components/cricket-game';

const PlayCricketPage = () => {
  const [gameConfig, setGameConfig] = useState<z.infer<
    typeof cricketConfigSchema
  > | null>(null);

  return (
    <div className="flex-1">
      {gameConfig ? (
        <CricketGame
          teams={gameConfig.teams}
          randomNums={gameConfig.cricketNumbersOption === 'randomNums'}
          numbers={gameConfig.numbers}
        />
      ) : (
        <CricketGameConfig onConfigured={setGameConfig} />
      )}
    </div>
  );
};

export default PlayCricketPage;
