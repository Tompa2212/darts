import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVerticalIcon } from 'lucide-react';

type Props = {
  player: {
    name: string;
    id: string;
  };
};

export default function PlayerSortable({ player }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: player.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        'text-muted-foreground touch-none rounded-sm p-1',
        isDragging && 'bg-muted text-primary shadow-md'
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
      <div className="flex touch-none items-center justify-between">
        {player.name}
        <Button size="icon" variant="ghost" className="touch-none">
          <GripVerticalIcon className="h-4 w-4" />
        </Button>
      </div>
    </li>
  );
}
