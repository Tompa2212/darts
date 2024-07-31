import React from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Props = {
  player: {
    name: string;
    id: string;
  };
};

export default function PlayerSortable({ player }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: player.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        'touch-none rounded-sm text-muted-foreground p-1',
        isDragging && 'shadow-md bg-muted text-primary'
      )}
      onPointerDown={(e) => {
        e.stopPropagation();

        if (listeners?.onPointerDown) {
          listeners.onPointerDown(e);
        }
      }}
      onKeyDown={(e) => {
        e.stopPropagation();

        if (listeners?.onKeyDown) {
          listeners.onKeyDown(e);
        }
      }}
      {...attributes}
    >
      <div className="flex items-center justify-between touch-none">
        {player.name}
        <Button size="icon" variant="ghost" className="touch-none">
          <Icon name="GripVertical" className="h-4 w-4" />
        </Button>
      </div>
    </li>
  );
}
