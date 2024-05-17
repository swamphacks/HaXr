import { Stack, Select, TextInput } from '@mantine/core';
import { PropsWithChildren } from 'react';
import classes from '@/styles/Input.module.css';
import { rem, Checkbox } from '@mantine/core';

import {
  FormQuestion,
  questionType,
  answerChoice,
  SelectionQuestion,
  Agreement,
} from '@/types/questionTypes';

function MLHChoice({
  choice,
  answerType,
}: {
  choice: answerChoice;
  answerType: questionType;
}) {
  switch (answerType) {
    case questionType.multiplechoice:
      return <Checkbox label={choice.value} disabled />;
    case questionType.checkbox:
    case questionType.agreement:
      return <Checkbox label={choice.value} disabled />;
    default:
      console.error(
        `Invalid answer type for MLHChoice: ${answerType}. Returning null.`
      );
      return null;
  }
}

export default function MLHQuestion({
  question,
  title,
}: {
  question: FormQuestion;
  title?: PropsWithChildren<any>;
}) {
  return (
    <div
      className='cursor-default touch-none rounded-md border-2 border-[var(--mantine-color-dark-2)] bg-[var(--mantine-color-body)] p-4 pt-2'
      style={{ width: rem(500) }}
    >
      <Stack>
        {question.type !== questionType.agreement ? (
          <h1 className={classes.input + ' mt-2 text-lg'}>
            {title || question.title}{' '}
            {question.required ? <em className='text-red-500'>*</em> : null}
          </h1>
        ) : null}
        <h2>
          <b className='font-bold'>Question Type</b>: {question.type}
        </h2>

        {/* Answer Choices */}
        {[
          questionType.multiplechoice,
          questionType.dropdown,
          questionType.checkbox,
        ].includes(question.type) ? (
          <>
            {question.type !== questionType.dropdown ? (
              (question as SelectionQuestion).answerChoices.map(
                (choice: answerChoice, i: number) => (
                  <MLHChoice
                    key={i}
                    choice={choice}
                    answerType={question.type}
                  />
                )
              )
            ) : (
              <Select
                data={(question as SelectionQuestion).answerChoices.map(
                  (c) => c.value
                )}
              />
            )}
          </>
        ) : null}
        {question.type === questionType.agreement ? (
          <Checkbox label={question.title} disabled />
        ) : null}

        {/* Address */}
        {question.type === questionType.address ? (
          <>
            <h2 className='text-lg font-semibold'>Fields </h2>
            <Stack>
              <h1 className='text-base'>Address Line 1</h1>
              <h1 className='text-base'>Address Line 2</h1>
              <h1 className='text-base'>City</h1>
              <h1 className='text-base'>State</h1>
              <h1 className='text-base'>Country</h1>
              <h1 className='text-base'>Pincode</h1>
            </Stack>
          </>
        ) : null}

        {/* Required */}

        {question.type === questionType.agreement &&
        (question as Agreement).mustAgree ? (
          <h2 className='text-lg text-red-500'>Must Agree</h2>
        ) : null}
      </Stack>
    </div>
  );
}
