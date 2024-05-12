import { useState, useEffect } from 'react';
import { Stack, Button, Select, Text, Paper } from '@mantine/core';
import { DndContext, closestCorners } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { IconGripHorizontal } from '@tabler/icons-react';
import { v4 as uuidv4 } from 'uuid';
import Choices from '@/components/admin/Choices';
import classes from '@/styles/Input.module.css';
import Droppable from '@/components/dnd/Droppable';
import { rem } from '@mantine/core';

import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

enum questionType {
  select = 'Select Answer Type',
  freeResponse = 'Free Response',
  shortResponse = 'Short Answer',
  multi = 'Multiple Select',
  radio = 'Multiple Choice',
}

type question = {
  title: string;
  description?: string;
  type: questionType;
  answerChoices?: string[];
  id: string;
};

type answerChoice = {
  value: string;
  id: string;
};

export default function Question({ question }: { question: question }) {
  const [value, setValue] = useState<string | null>(
    Object.values(questionType)[0] as string
  );
  const [choices, setChoices] = useState<answerChoice[]>([]);
  const getChoicePos = (id: string) =>
    choices.findIndex((choice: answerChoice) => choice.id === id);
  const handleDragged = (event: any) => {
    const { active, over } = event;
    if (active.id === over.id) return;

    setChoices((choices: answerChoice[]) => {
      const originalPos = getChoicePos(active.id);
      const newPos = getChoicePos(over.id);

      return arrayMove(choices, originalPos, newPos);
    });
  };

  const id = question.id;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  useEffect(() => {
    const textarea = document.getElementById(
      'autoresizing-textarea'
    ) as HTMLTextAreaElement;
    if (!textarea) {
      console.error('Could not load autoresizing element');
      return;
    }

    // Function to resize textarea
    const resizeTextarea = () => {
      // Reset the height to a minimum or to the scroll height, whichever is bigger
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    };

    // Resize on input events
    textarea.addEventListener('input', resizeTextarea);

    // Initial resize (useful if the textarea is pre-filled on page load)
    resizeTextarea();
  }, []);

  return (
    <div
      className='rounded-md border-2 border-[var(--mantine-color-dark-2)] p-4 pt-1'
      style={{ width: rem(500), ...style }}
      key={question.id}
      ref={setNodeRef}
      {...attributes}
    >
      <div className='flex-column mb-4 flex justify-center'>
        <IconGripHorizontal className='w-5' {...listeners} />
      </div>

      <Stack>
        <textarea
          id='autoresizing-textarea'
          placeholder='Enter question title'
          className={
            classes.input + ' box-border resize-none overflow-y-hidden text-lg'
          }
          required
        />
        <Select
          data={Object.values(questionType)}
          value={value}
          onChange={setValue}
          required
        />
        {value === questionType.radio || value === questionType.multi ? (
          <>
            <div className='grid grid-cols-2'>
              <Text size='lg'>Answer Choices</Text>
              <Button
                variant='outline'
                color='gray'
                onClick={() =>
                  setChoices([...choices, { value: '', id: uuidv4() }])
                }
                style={{ width: '8rem', justifySelf: 'end' }}
              >
                Add Choice
              </Button>
            </div>
            <DndContext
              collisionDetection={closestCorners}
              onDragEnd={handleDragged}
            >
              <Droppable id='droppable'>
                <Choices choices={choices} setChoices={setChoices} />
              </Droppable>
            </DndContext>
          </>
        ) : null}
      </Stack>
    </div>
  );
}
