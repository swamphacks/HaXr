import { Stack } from '@mantine/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Choice from '@/components/admin/Choice';

type answerChoice = {
  value: string;
  id: string;
};

export default function Choices({ choices }: { choices: answerChoice[] }) {
  return (
    <SortableContext items={choices} strategy={verticalListSortingStrategy}>
      <Stack align='stretch'>
        {choices.map((choice: answerChoice, index: number) => (
          <Choice key={choice.id} choice={choice} index={index} />
        ))}
      </Stack>
    </SortableContext>
  );
}
