import { storage } from '@/lib/local-storage';
import { CricketGameType } from '@/packages/cricket-game';
import { ZeroOneGameType } from '@/packages/zero-one/types';

const LOCAL_STORAGE_KEY = 'saved-games';
const SAVED_GAME_TYPES = ['cricket', '01'] as const;

type SavedCricketGame = Omit<CricketGameType, 'closedNumbers'> & {
  closedNumbers: number[];
};
type SavedZeroOneGame = ZeroOneGameType;

type StorageSavedGame =
  | {
      type: 'cricket';
      game: SavedCricketGame;
    }
  | {
      type: '01';
      game: SavedZeroOneGame;
    };

type SavedGameType = (typeof SAVED_GAME_TYPES)[number];

function savedGameMapper({ type, game }: StorageSavedGame) {
  if (type === '01') {
    return { type, game };
  }

  return {
    type,
    game: {
      ...game,
      closedNumbers: new Set(game.closedNumbers)
    }
  };
}

function cricketGameToSavedGame(game: CricketGameType) {
  return {
    ...game,
    closedNumbers: Array.from(game.closedNumbers)
  } as SavedCricketGame;
}

export type SavedGame =
  | {
      type: 'cricket';
      game: CricketGameType;
    }
  | {
      type: '01';
      game: ZeroOneGameType;
    };

function saveGame({ type, game }: SavedGame) {
  const gameDto = type === '01' ? game : cricketGameToSavedGame(game);

  let currectCricketGames =
    storage.getValue<Array<StorageSavedGame>>(LOCAL_STORAGE_KEY) || [];

  currectCricketGames = [
    { type, game: gameDto } as StorageSavedGame,
    ...currectCricketGames.filter((g) => g.game.id !== game.id)
  ];

  storage.setValue(LOCAL_STORAGE_KEY, JSON.stringify(currectCricketGames));
}

function getSavedGames() {
  return (
    storage.getValue<Array<StorageSavedGame>>(LOCAL_STORAGE_KEY) || []
  ).map(savedGameMapper) as SavedGame[];
}

function getGame(id: string) {
  const savedGame = getSavedGames().find((g) => g.game.id === id);
  if (!savedGame) {
    return null;
  }

  return savedGame;
}

function removeGame(id: string) {
  const allGames = storage.getValue<Array<StorageSavedGame>>(LOCAL_STORAGE_KEY);
  if (allGames === null) {
    return;
  }

  storage.setValue(
    LOCAL_STORAGE_KEY,
    JSON.stringify(allGames.filter((g) => g.game.id !== id))
  );
}

function getGameByIdAndType(
  id: string,
  type: 'cricket'
): CricketGameType | null;
function getGameByIdAndType(id: string, type: '01'): ZeroOneGameType | null;
function getGameByIdAndType(
  id: string,
  type: SavedGameType
): CricketGameType | ZeroOneGameType | null {
  let savedGame = getSavedGames().find(
    (g) => g.game.id === id && g.type === type
  )?.game;

  if (!savedGame) {
    return null;
  }

  return savedGame;
}

export const gameSaver = {
  saveGame,
  getSavedGames,
  getGame,
  getGameByIdAndType,
  removeGame
};
