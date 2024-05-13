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
  mlhRequired: boolean;
};

const requiredQuestions: question[] = [
  {
    title: 'First Name',
    type: questionType.shortResponse,
    mlhRequired: true,
    id: '1',
  },
  {
    title: 'Last Name',
    type: questionType.shortResponse,
    mlhRequired: true,
    id: '2',
  },
  {
    title: 'Age',
    type: questionType.radio,
    answerChoices: [
      'Under 18',
      '18-24',
      '25-34',
      '35-44',
      '45-54',
      '55-64',
      '65+',
    ],
    mlhRequired: true,
    id: '3',
  },
  {
    title: 'Phone Number',
    type: questionType.shortResponse,
    mlhRequired: true,
    id: '4',
  },
  {
    title: 'Email',
    type: questionType.shortResponse,
    mlhRequired: true,
    id: '5',
  },
  {
    title: 'School',
    type: questionType.radio,
    mlhRequired: true,
    answerChoices: [
      'University of Florida',
      'University of South Florida',
      'Florida State University',
      'University of Central Florida',
      'Florida International University',
      'Florida Atlantic University',
      'University of Miami',
      'Florida Gulf Coast University',
      'Florida A&M University',
      'Stetson University',
      'Embry-Riddle Aeronautical University',
      'Rollins College',
      'Florida Institute of Technology',
      'Other',
    ],
    id: '6',
  },
  {
    title: 'Level of Study',
    type: questionType.radio,
    mlhRequired: true,
    answerChoices: [
      'Less than Secondary / High School',
      'Secondary / High School',
      'Undergraduate University (2 year - community college or similar)',
      'Undergraduate University (3+ year)',
      'Graduate University (Masters, Professional, Doctoral, etc)',
      'Code School / Bottcamp',
      'Other Vocational / Trade Program or Apprenticeship',
      'Post Doctorate',
      'Other',
      "I'm not currently a student",
      'Prefer not to answer',
    ],
    id: '7',
  },
  {
    title: 'Country of Residence',
    type: questionType.radio,
    mlhRequired: true,
    answerChoices: [
      'United States',
      'Canada',
      'United Kingdom',
      'Australia',
      'Germany',
      'France',
      'India',
      'Netherlands',
      'Spain',
      'Italy',
      'Brazil',
      'China',
      'Japan',
      'South Korea',
      'Sweden',
      'Russia',
      'Switzerland',
      'Other',
    ],
    id: '8',
  },
];

export default function CreateForm() {
  const iconStyle = { width: rem(12), height: rem(12) };
  const [questions, setQuestions] = useState<question[]>(requiredQuestions);
  const handleAddQuestions = () => {
    setQuestions((oldQuestions: question[]) => {
      return [
        ...oldQuestions,
        {
          title: '',
          description: '',
          type: questionType.radio,
          answerChoices: [],
          mlhRequired: false,
          id: uuidv4(),
        },
      ];
    });
  };

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
                  <Question
                    key={q.id}
                    question={q}
                    setQuestions={setQuestions}
                    editable={false}
                  />
                ))}
              </SortableContext>
              <Button variant='light' color='gray' onClick={handleAddQuestions}>
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
