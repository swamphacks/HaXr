import { Stack, Select, TextInput } from '@mantine/core';
import { PropsWithChildren } from 'react';
import MLHChoice from '@/components/admin/MLHChoice';
import classes from '@/styles/Input.module.css';
import { rem } from '@mantine/core';

import { question, questionType } from '@/types/questionTypes';

function AnswerChoiceHeader() {
  return <h2 className='text-lg font-semibold'>Answer Choices</h2>;
}

export default function MLHQuestion({
  question,
  title,
}: {
  question: question;
  title?: PropsWithChildren<any>;
}) {
  return (
    <div
      className='cursor-default touch-none rounded-md border-2 border-[var(--mantine-color-dark-2)] bg-[var(--mantine-color-body)] p-4 pt-1'
      style={{ width: rem(500) }}
    >
      <Stack>
        <h1 className={classes.input + ' mt-2 text-lg'}>
          {title || question.title}
        </h1>
        <h2>
          <b className='font-bold'>Question Type</b>: {question.type}
        </h2>

        {/* Answer Choices */}
        {[questionType.multiplechoice, questionType.dropdown].includes(
          question.type
        ) ||
        (question.type === questionType.checkbox &&
          question.answerChoices &&
          question.answerChoices.length > 1) ? (
          <>
            <AnswerChoiceHeader />
            {question.type !== questionType.dropdown ? (
              question?.answerChoices?.map((choice: string, i: number) => (
                <MLHChoice key={i} choice={choice} />
              ))
            ) : (
              <Select
                data={
                  question.answerChoices
                    ? question.answerChoices.map((c) => c.value)
                    : []
                }
              />
            )}
          </>
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

        {question.mustAgree ? (
          <h2 className='text-lg text-red-500'>Must Agree</h2>
        ) : null}
      </Stack>
    </div>
  );
}
