import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { FormQuestion } from '@/types/questionTypes';
import Choice from '@/components/formCreator/Choice';

type answerChoice = {
  value: string;
  id: string;
};

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
      <SortableContext items={choices} strategy={verticalListSortingStrategy}>
        {choices.map((choice: answerChoice) => (
          <Choice
            key={choice.id}
            choice={choice}
            disabled={disabled}
            question={question}
            setQuestions={setQuestions}
          />
        ))}
      </SortableContext>
    </div>
  );
}
