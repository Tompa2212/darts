import { motion } from 'framer-motion';
import React from 'react';
import ResumeCricketMatch from './resume-cricket-match';
import { SavedGame } from '@/lib/games-saver/game-saver';
import ResumeZeroOneMatch from './resume-zero-one-match';

type ResumeMatchCardProps = {
  savedGame: SavedGame;
  onDeleteGame: (gameId: string) => void;
};

export default function ResumeMatchCard({ savedGame, onDeleteGame }: ResumeMatchCardProps) {
  return (
    <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }} layout>
      {savedGame.type === 'cricket' ? (
        <ResumeCricketMatch game={savedGame.game} onDeleteGame={onDeleteGame} />
      ) : (
        <ResumeZeroOneMatch game={savedGame.game} onDeleteGame={onDeleteGame} />
      )}
    </motion.div>
  );
}
