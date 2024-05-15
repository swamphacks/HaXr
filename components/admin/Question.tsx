import { useState } from 'react';
import { Stack, Button, Select, Switch, Divider } from '@mantine/core';
import { DndContext, closestCorners } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { IconGripHorizontal, IconTrash } from '@tabler/icons-react';
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
  checkbox = 'Checkbox',
  dropdown = 'Dropdown',
  radio = 'Radio',
}

type question = {
  title: string;
  description?: string;
  type: questionType;
  answerChoices?: string[];
  id: string;
  required: boolean;
  mlhRequired: boolean;
};

type answerChoice = {
  value: string;
  id: string;
};

function AnswerChoiceHeader() {
  return <h2 className='text-lg font-semibold'>Answer Choices</h2>;
}

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

  return (
    <div
      className='cursor-default rounded-md border-2 border-[var(--mantine-color-dark-2)] bg-[var(--mantine-color-body)] p-4 pt-1'
      style={{ width: rem(500), ...style }}
      key={question.id}
      ref={setNodeRef}
      {...attributes}
    >
      {!question.mlhRequired ? (
        <div className='grid grid-cols-3'>
          <div />
          <IconGripHorizontal
            className='w-5 cursor-pointer justify-self-center'
            {...listeners}
          />
        </div>
      ) : null}

      <Stack>
        {!question.mlhRequired ? (
          <textarea
            placeholder='Enter question title'
            className={
              classes.input +
              ' box-border h-8 resize-y overflow-y-hidden text-lg'
            }
            required
          />
        ) : (
          <h1 className={classes.input + ' mt-2 text-lg'}>{question.title}</h1>
        )}
        {!question.mlhRequired ? (
          <Select
            data={Object.values(questionType)}
            value={selectedQuestionType}
            onChange={setQuestionType}
            required
          />
        ) : (
          <h2>
            <b className='font-bold'>Question Type</b>: {question.type}
          </h2>
        )}
        {selectedQuestionType === questionType.radio ||
        selectedQuestionType === questionType.checkbox ||
        selectedQuestionType === questionType.dropdown ? (
          <>
            <div className='grid grid-cols-2'>
              <AnswerChoiceHeader />
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
        {question.mlhRequired &&
        (question.type === questionType.radio ||
          question.type === questionType.checkbox) ? (
          <div className='grid grid-rows-2'>
            <AnswerChoiceHeader />
            <Choices
              choices={
                question.answerChoices
                  ? question.answerChoices.map((c: string, i: number) => ({
                      value: c,
                      id: i.toString(),
                    }))
                  : []
              }
              setChoices={setChoices}
              editable={false}
            />
          </div>
        ) : null}
        {question.mlhRequired && question.type === questionType.dropdown ? (
          <Select data={question.answerChoices} />
        ) : null}
        {!question.mlhRequired ? (
          <>
            <div className='w-full border border-solid border-[var(--tab-border-color)]' />
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
          </>
        ) : null}
      </Stack>
    </div>
  );
}
