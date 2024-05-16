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
  editable = true,
}: {
  choices: answerChoice[];
  editable?: boolean;
}) {
  return (
    <div className='flex flex-col gap-2'>
      {editable ? (
        <SortableContext items={choices} strategy={verticalListSortingStrategy}>
          {choices.map((choice: answerChoice) => (
            <Choice key={choice.id} choice={choice} editable={editable} />
          ))}
        </SortableContext>
      ) : (
        <>
          {choices.map((choice: answerChoice) => (
            <Choice key={choice.id} choice={choice} editable={editable} />
          ))}
        </>
      )}
    </div>
  );
}
