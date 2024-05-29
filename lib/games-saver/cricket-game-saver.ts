import { storage } from '@/lib/local-storage';
import { CricketGameType } from '@/packages/cricket-game';

type SavedCricketGame = Omit<CricketGameType, 'closedNumbers'> & {
  closedNumbers: number[];
};

const LOCAL_STORAGE_KEY = 'cricket-games';

function savedGameToCricketGame(savedGame: SavedCricketGame) {
  return {
    ...savedGame,
    closedNumbers: new Set(savedGame.closedNumbers)
  } as CricketGameType;
}

function cricketGameToSavedGame(game: CricketGameType) {
  return {
    ...game,
    closedNumbers: Array.from(game.closedNumbers)
  } as SavedCricketGame;
}

function saveGame(game: CricketGameType) {
  const gameCopy = cricketGameToSavedGame(game);

  let currectCricketGames =
    storage.getValue<Array<SavedCricketGame>>(LOCAL_STORAGE_KEY) || [];

  currectCricketGames = [
    gameCopy,
    ...currectCricketGames.filter((g) => g.id !== game.id)
  ];

  storage.setValue(LOCAL_STORAGE_KEY, JSON.stringify(currectCricketGames));
}

function getSavedGames() {
  return (
    storage.getValue<Array<SavedCricketGame>>(LOCAL_STORAGE_KEY) || []
  ).map(savedGameToCricketGame);
}

function getGame(id: string) {
  const savedGame = getSavedGames().find((g) => g.id === id);
  if (!savedGame) {
    return null;
  }

  return savedGame;
}

function removeGame(id: string) {
  const allGames = storage.getValue<Array<SavedCricketGame>>(LOCAL_STORAGE_KEY);
  if (allGames === null) {
    return;
  }

  storage.setValue(
    LOCAL_STORAGE_KEY,
    JSON.stringify(allGames.filter((g) => g.id !== id))
  );
}

export const cricketGameSaver = {
  saveGame,
  getSavedGames,
  getGame,
  removeGame
};
