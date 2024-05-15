'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Stack,
  Tabs,
  rem,
  Accordion,
  Checkbox,
} from '@mantine/core';
import {
  IconForms,
  IconMessageCircle,
  IconSettings,
  IconPlus,
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
import accordionClasses from '@/styles/CreateForm.module.css';
import Image from 'next/image';

enum questionType {
  radio = 'Radio',
  checkbox = 'Checkbox',
  freeResponse = 'Free Response',
  dropdown = 'Dropdown',
  shortResponse = 'Short Answer',
}

type question = {
  title: string;
  description?: string;
  type: questionType;
  answerChoices?: string[];
  id: string;
  mlhRequired: boolean;
  required: boolean;
};

const requiredQuestions: question[] = [
  {
    title: 'First Name',
    type: questionType.shortResponse,
    mlhRequired: true,
    required: true,
    id: '1',
  },
  {
    title: 'Last Name',
    type: questionType.shortResponse,
    mlhRequired: true,
    required: true,
    id: '2',
  },
  {
    title: 'Age',
    type: questionType.dropdown,
    required: true,
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
    required: true,
    id: '4',
  },
  {
    title: 'Email',
    type: questionType.shortResponse,
    mlhRequired: true,
    id: '5',
    required: true,
  },
  {
    title: 'School',
    type: questionType.dropdown,
    mlhRequired: true,
    required: true,
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
    required: true,
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
    type: questionType.dropdown,
    mlhRequired: true,
    required: true,
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

function FormCreator({
  questions,
  setQuestions,
  includeMLH,
}: {
  questions: question[];
  setQuestions: any;
  includeMLH: boolean;
}) {
  const handleAddQuestions = () => {
    setQuestions((oldQuestions: question[]) => {
      return [
        ...oldQuestions,
        {
          title: '',
          description: '',
          type: questionType.radio,
          answerChoices: [],
          required: false,
          mlhRequired: false,
          id: uuidv4(),
        },
      ];
    });
  };
  return (
    <>
      <Stack gap='md' align='center' justify='flex-start'>
        <Box w={rem(500)}>
          <input placeholder='Untitled Form' className={classes.title} />
        </Box>
      </Stack>

      <Accordion
        classNames={{
          label: accordionClasses.label,
          panel: accordionClasses.panel,
        }}
      >
        {includeMLH ? (
          <Accordion.Item key='MLH' value='MLH Required Questions'>
            <Accordion.Control
              icon={
                <Image
                  src='/logos/mlh-logo-color.svg'
                  alt='MLH Logo'
                  width={70}
                  height={70}
                />
              }
            >
              MLH Required Questions
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap='md' align='center' justify='flex-start'>
                {questions.map((q: question, _) =>
                  q.mlhRequired ? (
                    <Question
                      key={q.id}
                      question={q}
                      setQuestions={setQuestions}
                    />
                  ) : null
                )}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        ) : null}

        <Accordion.Item key='Additional' value='Additional Questions'>
          <Accordion.Control
            icon={<IconPlus stroke={1} className='h-10 w-10' />}
          >
            Additional Questions
          </Accordion.Control>
          <Accordion.Panel>
            <DndContext
              collisionDetection={closestCorners}
              onDragEnd={(event) => handleDragged(event, setQuestions)}
            >
              <Droppable id='droppable2'>
                <Stack gap='md' align='center' justify='flex-start'>
                  <SortableContext
                    items={questions}
                    strategy={verticalListSortingStrategy}
                  >
                    {questions.map((q: question, _) =>
                      !q.mlhRequired ? (
                        <Question
                          key={q.id}
                          question={q}
                          setQuestions={setQuestions}
                        />
                      ) : null
                    )}
                  </SortableContext>
                  <Button
                    variant='light'
                    color='gray'
                    onClick={handleAddQuestions}
                  >
                    Add Question
                  </Button>
                </Stack>
              </Droppable>
            </DndContext>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <Stack gap='md' align='center' justify='flex-start' className='mt-4'>
        <Button>Save Form</Button>
      </Stack>
    </>
  );
}

function Settings({ setIncludeMLH }: { setIncludeMLH: any }) {
  return (
    <div className='mt-8 flex flex-col items-center'>
      <div className='w-full max-w-2xl'>
        <h1 className='mb-2 text-2xl font-bold'>Questions</h1>
        <div className='mb-6 border border-solid border-[var(--tab-border-color)]' />
        <Checkbox
          defaultChecked
          onChange={() => setIncludeMLH((value: boolean) => !value)}
          label='Include MLH Required Questions'
        />
      </div>
    </div>
  );
}

export default function CreateForm() {
  const iconStyle = { width: rem(12), height: rem(12) };
  const [questions, setQuestions] = useState<question[]>(requiredQuestions);
  const [includeMLH, setIncludeMLH] = useState(true);

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
        <FormCreator
          questions={questions}
          setQuestions={setQuestions}
          includeMLH={includeMLH}
        />
      </Tabs.Panel>

      <Tabs.Panel value='messages'>Responses tab content</Tabs.Panel>

      <Tabs.Panel value='settings'>
        <Settings setIncludeMLH={setIncludeMLH} />
      </Tabs.Panel>
    </Tabs>
  );
}
