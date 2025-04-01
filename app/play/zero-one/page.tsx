'use client';

import React from 'react';
import type { ZeroOneGameConfig as ZeroOneGameConfigType } from '@/types/client/zero-one';
import { ZeroOneGame } from './_components/zero-one-game';
import { ZeroOneGameConfig } from './_components/zero-one-game-config';
import { useSearchParams } from 'next/navigation';
import { SavedZeroOneGame } from './_components/saved-zero-one-game';

export default function PlayZeroOnePage() {
  const [gameConfig, setGameConfig] = React.useState<ZeroOneGameConfigType | null>(null);

  const searchParams = useSearchParams();
  const gameId = searchParams.get('gameId');

  if (gameId) {
    return (
      <Container>
        <SavedZeroOneGame id={gameId} />
      </Container>
    );
  }

  if (!gameConfig) {
    return (
      <Container>
        <ZeroOneGameConfig onConfigured={setGameConfig} />
      </Container>
    );
  }

  return (
    <Container>
      <ZeroOneGame {...gameConfig} />
    </Container>
  );
}

function Container({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 xl:container">{children}</div>;
}
