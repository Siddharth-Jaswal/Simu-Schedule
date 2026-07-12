import { useDraggable } from '@dnd-kit/core';
import type { ProcessDTO } from '@shared/types';
import { ProcessNode } from '../visualization/ProcessNode';

interface DraggableProcessProps {
  process: ProcessDTO;
}

export function DraggableProcess({ process }: DraggableProcessProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: process.pid,
    data: { process }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1,
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing inline-block">
      <ProcessNode process={process} />
    </div>
  );
}
