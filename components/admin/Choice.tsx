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
  choice,
  index,
}: {
  choice: answerChoice;
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
    <Group key={choice.id} ref={setNodeRef} {...attributes} style={style}>
      <IconGripVertical {...listeners} style={{ width: '1.2rem' }} />
      <TextInput
        defaultValue={choice.value}
        rightSection={
          <CloseButton
          // onClick={() => setChoices(choices.filter((_, i) => i !== index))}
          />
        }
      />
    </Group>
  );
}
