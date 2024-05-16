import { useState } from 'react';
import { createContext } from 'react';
import { Stack, Select, Switch, Divider } from '@mantine/core';
import {
  DndContext,
  closestCorners,
  useSensors,
  useSensor,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { IconGripHorizontal, IconTrash } from '@tabler/icons-react';
import { v4 as uuidv4 } from 'uuid';
import Choices from '@/components/admin/Choices';
import classes from '@/styles/Input.module.css';
import Droppable from '@/components/dnd/Droppable';
import { rem } from '@mantine/core';

import { CSS } from '@dnd-kit/utilities';
import { useSortable, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { question, questionType, answerChoice } from '@/types/questionTypes';

function AnswerChoiceHeader() {
  return <h2 className='text-lg font-semibold'>Answer Choices</h2>;
}

export const OtherIncludedContext = createContext({
  otherIncluded: false,
  setOther: (value: boolean) => {},
});

export default function Question({
  question,
  setQuestions,
}: {
  question: question;
  setQuestions: any;
}) {
  const [selectedQuestionType, setQuestionType] = useState<string | null>(
    Object.values(questionType)[0] as string
  );
  const [choices, setChoices] = useState<answerChoice[]>([]);
  const [required, setRequired] = useState<boolean>(false);
  const [otherIncluded, setOther] = useState<boolean>(false);

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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div
      className='cursor-default touch-none rounded-md border-2 border-[var(--mantine-color-dark-2)] bg-[var(--mantine-color-body)] p-4 pt-1'
      style={{ width: rem(500), ...style }}
      key={question.id}
      ref={setNodeRef}
      {...attributes}
    >
      <div className='grid grid-cols-3'>
        <div />
        <IconGripHorizontal
          className='w-5 cursor-pointer justify-self-center'
          {...listeners}
        />
      </div>

      <Stack>
        <textarea
          placeholder='Enter question title'
          className={
            classes.input + ' box-border h-8 resize-y overflow-y-hidden text-lg'
          }
          required
        />

        {/* Answer Choices */}
        <Select
          data={Object.values(questionType)}
          value={selectedQuestionType}
          onChange={setQuestionType}
          required
        />
        {selectedQuestionType === questionType.radio ||
        selectedQuestionType === questionType.checkbox ||
        selectedQuestionType === questionType.dropdown ? (
          <OtherIncludedContext.Provider value={{ otherIncluded, setOther }}>
            <AnswerChoiceHeader />
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragEnd={handleDragged}
            >
              <Droppable id='droppable'>
                <Choices choices={choices} setChoices={setChoices} />
              </Droppable>
            </DndContext>
            <div className='flex flex-row gap-2'>
              <button
                onClick={() => {
                  return otherIncluded
                    ? setChoices([
                        ...choices.slice(0, -1),
                        { value: '', id: uuidv4() },
                        choices[choices.length - 1],
                      ])
                    : setChoices([...choices, { value: '', id: uuidv4() }]);
                }}
              >
                Add Choice
              </button>
              {!otherIncluded ? (
                <>
                  <p> or </p>
                  <button
                    onClick={() => {
                      setChoices([
                        ...choices,
                        { value: '', id: uuidv4(), other: true },
                      ]);
                      setOther(true);
                    }}
                    className='text-blue-500'
                  >
                    add &quot;Other&quot;
                  </button>
                </>
              ) : null}
            </div>
          </OtherIncludedContext.Provider>
        ) : null}
        <Divider />
        <div className='flex flex-row-reverse items-center gap-4'>
          <Switch
            label='Required'
            onChange={() =>
              setRequired((value) => {
                return !value;
              })
            }
            size='xs'
            labelPosition='left'
          />
          <Divider orientation='vertical' />
          <button
            className='justify-self-end'
            onClick={() =>
              setQuestions((oldQuestions: question[]) =>
                oldQuestions.filter((q) => q.id !== question.id)
              )
            }
          >
            <IconTrash className='w-5' stroke={1.25} />
          </button>
        </div>
      </Stack>
    </div>
  );
}
