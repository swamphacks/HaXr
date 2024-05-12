import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Choice from '@/components/admin/Choice';

type answerChoice = {
  value: string;
  id: string;
};

export default function Choices({
  choices,
  setChoices,
}: {
  choices: answerChoice[];
  setChoices: any;
}) {
  return (
    <SortableContext items={choices} strategy={verticalListSortingStrategy}>
      {choices.map((choice: answerChoice) => (
        <Choice
          key={choice.id}
          choices={choices}
          choice={choice}
          setChoices={setChoices}
        />
      ))}
    </SortableContext>
  );
}
