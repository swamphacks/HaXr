import NextImage from 'next/image';
import { CloseButton } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';

import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

import classes from '@/styles/Input.module.css';

type answerChoice = {
  value: string;
  id: string;
};

export default function Choice({
  choices,
  choice,
  setChoices,
}: {
  choices: answerChoice[];
  choice: answerChoice;
  setChoices: any;
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
      <IconGripVertical {...listeners} className='w-[1.2rem]' />
      <input
        type='text'
        defaultValue={choice.value}
        className={classes.input}
      />
      <CloseButton
        onClick={() =>
          setChoices(choices.filter((c: answerChoice) => c.id !== choice.id))
        }
      />
    </div>
  );
}
