import { CloseButton, Radio, Checkbox } from '@mantine/core';
import {
  FormQuestion,
  SelectionQuestion,
  answerChoice,
  QuestionType,
} from '@/types/question';

export function Choice({
  choice,
  question,
  setQuestions,
  disabled,
}: {
  choice: answerChoice;
  question: FormQuestion;
  setQuestions: any;
  disabled: boolean;
}) {
  const handleTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    choice.value = e.target.value;
    setQuestions((questions: FormQuestion[]) => {
      const choices: answerChoice[] = (question as SelectionQuestion)
        .answerChoices;
      return questions.map((q: FormQuestion) =>
        q.id === question.id
          ? {
              ...question,
              answerChoices: choices.map((c: answerChoice) =>
                c.id === choice.id ? choice : c
              ),
            }
          : q
      );
    });
  };

  const handleDeletion = () => {
    setQuestions((questions: FormQuestion[]) =>
      questions.map((q: FormQuestion) =>
        q.id === question.id
          ? {
              ...question,
              answerChoices: (
                question as SelectionQuestion
              ).answerChoices.filter((c: answerChoice) => c.id !== choice.id),
            }
          : q
      )
    );
  };

  return (
    <div
      key={choice.id}
      className='grid touch-none grid-cols-[1.3rem_auto_1.3rem] items-center'
    >
      {/* Text Input */}
      <div className='col-start-2 flex flex-row items-center'>
        {question.type === QuestionType.multiplechoice ? (
          <Radio disabled className='mr-2' />
        ) : null}
        {question.type === QuestionType.checkbox ? (
          <Checkbox disabled className='mr-2' />
        ) : null}
        <input
          type='text'
          defaultValue={choice.value}
          onChange={handleTextInput}
          className='bg-transparentk w-full border-[2px] border-solid px-0 focus:border-[var(--mantine-color-blue-3)] focus:outline-none'
          disabled={disabled}
        />
      </div>

      {/* Delete Button */}
      {!disabled ? <CloseButton onClick={handleDeletion} /> : null}
    </div>
  );
}

export default function Choices({
  choices,
  question,
  setQuestions,
  disabled = false,
}: {
  choices: answerChoice[];
  question: FormQuestion;
  setQuestions: (questions: FormQuestion[]) => void;
  disabled?: boolean;
}) {
  return (
    <div className='flex flex-col gap-2'>
      {choices.map((choice: answerChoice) => (
        <Choice
          key={choice.id}
          choice={choice}
          disabled={disabled}
          question={question}
          setQuestions={setQuestions}
        />
      ))}
    </div>
  );
}
