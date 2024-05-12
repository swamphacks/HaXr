import { arrayMove } from '@dnd-kit/sortable';

function getArrayPos(array: any[], id: string) {
  return array.findIndex((el: any) => el.id === id);
}

export function handleDragged(event: any, setState: any) {
  const { active, over } = event;
  if (active.id === over.id) return;

  setState((elements: any[]) => {
    const originalPos = getArrayPos(elements, active.id);
    const newPos = getArrayPos(elements, over.id);

    return arrayMove(elements, originalPos, newPos);
  });
}
