import NextImage from 'next/image';
import { Group, CloseButton, TextInput, Burger, Image } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';

import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

type answerChoice = {
  value: string;
  id: string;
};

export default function Choice({
  choices,
  choice,
  setChoices,
  index,
}: {
  choices: answerChoice[];
  choice: answerChoice;
  setChoices: any;
  index: number;
}) {
  const id = choice.id;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  return (
    <div
      key={choice.id}
      ref={setNodeRef}
      {...attributes}
      style={style}
      className='mb-2 grid grid-cols-[1.3rem_auto_1.3rem] items-center'
    >
      <IconGripVertical {...listeners} style={{ width: '1.2rem' }} />
      <TextInput defaultValue={choice.value} />
      <CloseButton
        onClick={() =>
          setChoices(choices.filter((c: answerChoice) => c.id !== choice.id))
        }
      />
    </div>
  );
}
