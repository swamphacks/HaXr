import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { questionType } from '@/types/questionTypes';
import Choice from '@/components/admin/Choice';

type answerChoice = {
  value: string;
  id: string;
};

export default function Choices({
  choices,
  questionType,
  disabled = false,
}: {
  choices: answerChoice[];
  questionType: questionType;
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
            questionType={questionType}
          />
        ))}
      </SortableContext>
    </div>
  );
}
