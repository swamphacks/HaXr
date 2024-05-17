import { useContext } from 'react';
import { OtherIncludedContext } from '@/components/admin/Question';
import { CloseButton, Radio, Checkbox } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';

import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

import classes from '@/styles/Input.module.css';

import { answerChoice } from '@/types/questionTypes';
import { questionType as qType } from '@/types/questionTypes';

function ChoiceInput({
  choice,
  setChoices,
  setOther,
  disabled,
  questionType,
}: {
  choice: answerChoice;
  setChoices: any;
  setOther: any;
  disabled: boolean;
  questionType: qType;
}) {
  const id = choice.id;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    choice.value = e.target.value;
    setChoices((choices: answerChoice[]) => {
      const index = choices.findIndex((c: answerChoice) => c.id === choice.id);
      return [...choices.slice(0, index), choice, ...choices.slice(index + 1)];
    });
  };

  return (
    <div
      key={choice.id}
      ref={setNodeRef}
      {...attributes}
      style={style}
      className='grid touch-none grid-cols-[1.3rem_auto_1.3rem] items-center'
    >
      {!disabled ? (
        <IconGripVertical {...listeners} className='w-[1.2rem]' />
      ) : null}

      <div className='col-start-2 flex flex-row items-center'>
        {questionType === qType.multiplechoice ? (
          <Radio disabled className='mr-2' />
        ) : null}
        {questionType === qType.checkbox ? (
          <Checkbox disabled className='mr-2' />
        ) : null}
        <input
          type='text'
          defaultValue={choice.value}
          onChange={(e) => handleInput(e)}
          className={classes.input}
          disabled={disabled}
        />
      </div>
      {!disabled ? (
        <CloseButton
          onClick={() => {
            setChoices((choices: answerChoice[]) =>
              choices.filter((c: answerChoice) => c.id !== choice.id)
            );
            if (choice.other) {
              setOther(false);
            }
          }}
        />
      ) : null}
    </div>
  );
}

export default function Choice({
  choice,
  questionType,
  disabled = false,
}: {
  choice: answerChoice;
  questionType: qType;
  disabled?: boolean;
}) {
  const { setOther, setChoices } = useContext(OtherIncludedContext);

  return (
    <>
      {!choice.other ? (
        <ChoiceInput
          choice={choice}
          setChoices={setChoices}
          setOther={setOther}
          questionType={questionType}
          disabled={disabled}
        />
      ) : null}
      {choice.other ? (
        <div className='grid grid-cols-[1.3rem_auto_1.3rem] items-center'>
          <div />
          <div className='flex flex-row'>
            {questionType === qType.multiplechoice ? (
              <Radio disabled className='mr-2' />
            ) : null}
            {questionType === qType.checkbox ? (
              <Checkbox disabled className='mr-2' />
            ) : null}
            <p className={classes.input + ' col-start-2'}>Other...</p>
          </div>
          <CloseButton
            onClick={() => {
              setChoices((choices: answerChoice[]) =>
                choices.filter((c: answerChoice) => c.id !== choice.id)
              );
              if (choice.other) {
                setOther(false);
              }
            }}
          />
        </div>
      ) : null}
    </>
  );
}
