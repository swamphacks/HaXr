import { useState } from 'react';
import { Button, TextInput, Select, Text } from '@mantine/core';
import { useDroppable, DndContext, closestCorners } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';
import Choices from '@/components/admin/Choices';

enum questionType {
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
};

type answerChoice = {
  value: string;
  id: string;
};

function Droppable(props: { children: React.ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable',
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}

export default function Question(props: question) {
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
  return (
    <>
      <TextInput label='Title' placeholder='Enter question title' required />
      <TextInput label='Description' placeholder='Enter question description' />
      <Select
        label='Type'
        data={Object.values(questionType)}
        value={value}
        onChange={setValue}
        required
      />
      {value === questionType.radio || value === questionType.multi ? (
        <>
          <Text>Answer Choices</Text>
          <DndContext
            collisionDetection={closestCorners}
            onDragEnd={handleDragged}
          >
            <Droppable>
              <Choices choices={choices} />
            </Droppable>
          </DndContext>
          <Button
            onClick={() =>
              setChoices([...choices, { value: '', id: uuidv4() }])
            }
          >
            Add Choice
          </Button>
        </>
      ) : null}
    </>
  );
}
