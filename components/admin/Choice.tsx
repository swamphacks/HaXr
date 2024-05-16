import { useContext } from 'react';
import { OtherIncludedContext } from '@/components/admin/Question';
import { CloseButton } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';

import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

import classes from '@/styles/Input.module.css';

import { answerChoice } from '@/types/questionTypes';

function ChoiceInput({
  choice,
  setChoices,
  choices,
  setOther,
}: {
  choice: answerChoice;
  setChoices: any;
  choices: answerChoice[];
  setOther: any;
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
      className='grid touch-none grid-cols-[1.3rem_auto_1.3rem] items-center'
    >
      <IconGripVertical {...listeners} className='w-[1.2rem]' />
      <input
        type='text'
        defaultValue={choice.value}
        className={classes.input}
      />
      <CloseButton
        onClick={() => {
          setChoices(choices.filter((c: answerChoice) => c.id !== choice.id));
          if (choice.other) {
            setOther(false);
          }
        }}
      />
    </div>
  );
}

export default function Choice({
  choices,
  setChoices,
  choice,
  editable = true,
}: {
  choices: answerChoice[];
  setChoices: any;
  choice: answerChoice;
  editable?: boolean;
}) {
  const { _, setOther } = useContext(OtherIncludedContext);

  return (
    <>
      {editable && !choice.other ? (
        <ChoiceInput
          choice={choice}
          setChoices={setChoices}
          choices={choices}
          setOther={setOther}
        />
      ) : null}
      {editable && choice.other ? (
        <div className='grid grid-cols-[1.3rem_auto_1.3rem] items-center'>
          <p className={classes.input + ' col-start-2'}>Other...</p>
          <CloseButton
            onClick={() => {
              setChoices(
                choices.filter((c: answerChoice) => c.id !== choice.id)
              );
              if (choice.other) {
                setOther(false);
              }
            }}
          />
        </div>
      ) : null}
      {!editable ? <p className={classes.input}>{choice.value}</p> : null}
    </>
  );
}
