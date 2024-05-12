'use client';

import { useState } from 'react';
import { Box, Button, Stack, Tabs, rem } from '@mantine/core';
import {
  IconForms,
  IconMessageCircle,
  IconSettings,
} from '@tabler/icons-react';
import Question from '@/components/admin/Question';
import classes from '@/styles/Input.module.css';
import Droppable from '@/components/dnd/Droppable';
import { DndContext, closestCorners } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';
import { handleDragged } from '@/components/dnd/utils';

enum questionType {
  radio = 'Multiple Choice',
  multi = 'Multiple Select',
  freeResponse = 'Free Response',
  shortResponse = 'Short Answer',
}

type question = {
  title: string;
  description?: string;
  type: questionType;
  answerChoices?: string[];
  id: string;
};

export default function CreateForm() {
  const iconStyle = { width: rem(12), height: rem(12) };
  const [questions, setQuestions] = useState<question[]>([]);

  return (
    <Tabs defaultValue='gallery'>
      <Tabs.List justify='center'>
        <Tabs.Tab value='gallery' leftSection={<IconForms style={iconStyle} />}>
          Questions
        </Tabs.Tab>
        <Tabs.Tab
          value='messages'
          leftSection={<IconMessageCircle style={iconStyle} />}
        >
          Responses
        </Tabs.Tab>{' '}
        <Tabs.Tab
          value='settings'
          leftSection={<IconSettings style={iconStyle} />}
        >
          Settings
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value='gallery'>
        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={(event) => handleDragged(event, setQuestions)}
        >
          <Droppable id='droppable2'>
            <Stack gap='md' align='center' justify='flex-start'>
              <Box w={rem(500)}>
                <input placeholder='Untitled Form' className={classes.title} />
              </Box>
              <SortableContext
                items={questions}
                strategy={verticalListSortingStrategy}
              >
                {questions.map((q: question, _) => (
                  <Question key={q.id} question={q} />
                ))}
              </SortableContext>
              <Button
                variant='light'
                color='gray'
                onClick={() =>
                  setQuestions([
                    ...questions,
                    {
                      title: '',
                      description: '',
                      type: questionType.radio,
                      answerChoices: [],
                      id: uuidv4(),
                    },
                  ])
                }
              >
                Add Question
              </Button>
            </Stack>
          </Droppable>
        </DndContext>
      </Tabs.Panel>

      <Tabs.Panel value='messages'>Responses tab content</Tabs.Panel>

      <Tabs.Panel value='settings'>Settings tab content</Tabs.Panel>
    </Tabs>
  );
}
