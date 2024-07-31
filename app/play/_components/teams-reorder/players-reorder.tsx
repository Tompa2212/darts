import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import PlayerSortable from './player-sortable';
import { ConfigTeamPlayer } from '@/types/client/game-config';

type PlayersReorderProps = {
  players: ConfigTeamPlayer[];
  onPlayersReorder: (players: ConfigTeamPlayer[]) => void;
};

function PlayersReorder({ players, onPlayersReorder }: PlayersReorderProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || !active) {
      return;
    }

    if (active.id !== over.id) {
      const activePlayerId = active.id;
      const overPlayerId = over.id;

      const oldIndex = players.findIndex(
        (p) => p.id === activePlayerId || p.name === activePlayerId
      );
      const newIndex = players.findIndex(
        (p) => p.id === overPlayerId || p.name === overPlayerId
      );

      onPlayersReorder(arrayMove(players, oldIndex, newIndex));
    }
  }

  const uniqueIdentifierPlayers = players.map((player) => ({
    ...player,
    id: player.id || player.name
  }));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={uniqueIdentifierPlayers}
        strategy={verticalListSortingStrategy}
      >
        <ul>
          {uniqueIdentifierPlayers.map((player) => (
            <PlayerSortable key={player.id} player={player} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

export default PlayersReorder;
