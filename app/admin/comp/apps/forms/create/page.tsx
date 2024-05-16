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
import {
  DndContext,
  closestCorners,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensors,
  useSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';
import { handleDragged } from '@/components/dnd/utils';
import accordionClasses from '@/styles/CreateForm.module.css';
import Image from 'next/image';
import MLHQuestion from '@/components/admin/MLHQuestion';
import { question, questionType } from '@/types/questionTypes';

const requiredQuestions: question[] = [
  {
    title: 'First Name',
    type: questionType.shortResponse,
    mlh: true,
    required: true,
    id: '1',
  },
  {
    title: 'Last Name',
    type: questionType.shortResponse,
    mlh: true,
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
    mlh: true,
    id: '3',
  },
  {
    title: 'Phone Number',
    type: questionType.shortResponse,
    mlh: true,
    required: true,
    id: '4',
  },
  {
    title: 'Email',
    type: questionType.shortResponse,
    mlh: true,
    id: '5',
    required: true,
  },
  {
    title: 'School',
    type: questionType.dropdown,
    mlh: true,
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
    mlh: true,
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
    mlh: true,
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
  {
    title:
      'I have read and agree to the MLH Code of Conduct. (https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md)',
    type: questionType.checkbox,
    mlh: true,
    required: true,
    mustAgree: true,
    id: '9',
  },
  {
    title:
      'I authorize you to share my application/registration information with Major League Hacking for event administration, ranking, and MLH administration in-line with the MLH Privacy Policy (https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md). I further agree to the terms of both the MLH Contest Terms and Conditions (https://github.com/MLH/mlh-policies/blob/main/contest-terms.md) and the MLH Privacy Policy (https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md).',
    type: questionType.checkbox,
    mlh: true,
    required: true,
    mustAgree: true,
    id: '10',
  },
  {
    title:
      'I authorize MLH to send me occasional emails about relevant events, career opportunities, and community announcements.',
    type: questionType.checkbox,
    mlh: true,
    required: true,
    mustAgree: false,
    id: '0',
  },
  {
    title: 'Dietary Restrictions',
    type: questionType.checkbox,
    mlh: true,
    required: false,
    id: '11',
    answerChoices: [
      'Vegetarian',
      'Vegan',
      'Celiac Disease',
      'Allergies',
      'Kosher',
      'Halal',
    ],
  },
  {
    title:
      'Do you identify as part of an underrepresented group in the technology industry?',
    type: questionType.radio,
    required: false,
    mlh: true,
    id: '12',
    answerChoices: ['Yes', 'No', 'Unsure'],
  },
  {
    title: 'Gender',
    type: questionType.radio,
    required: false,
    mlh: true,
    answerChoices: [
      'Man',
      'Woman',
      'Non-Binary',
      'Prefer Not to self-describe',
      'Prefer Not to Answer',
    ],
    id: '13',
  },
  {
    title: 'Pronouns',
    type: questionType.radio,
    required: false,
    mlh: true,
    answerChoices: [
      'He/Him',
      'She/Her',
      'They/Them',
      'She/They',
      'He/They',
      'Prefer Not to Answer',
      'Other',
    ],
    id: '14',
  },
  {
    title: 'Race / Ethnicity',
    type: questionType.checkbox,
    required: false,
    mlh: true,
    answerChoices: [
      'American Indian or Alaska Native',
      'Asian',
      'Black or African American',
      'Hispanic or Latino',
      'Native Hawaiian or Other Pacific Islander',
      'White',
      'Prefer not to answer',
      'Other',
    ],
    id: '15',
  },
  {
    title: 'Do you consider yourself any of the following?',
    mlh: true,
    required: false,
    type: questionType.radio,
    answerChoices: [
      'Heterosexual or Straight',
      'Gay or Lesbian',
      'Bisexual',
      'Other',
      'Prefer not to answer',
    ],
    id: '16',
  },
  {
    title:
      'What is the highest level of formal education that you have completed?',
    mlh: true,
    required: false,
    type: questionType.radio,
    answerChoices: [
      'Less than High School',
      'High School Diploma or Equivalent',
      'Some College',
      'Associate Degree',
      'Bachelor’s Degree',
      'Master’s Degree',
      'Professional Degree (MD, JD, etc)',
      'Doctorate Degree',
      'Other',
    ],
    id: '17',
  },
  {
    title: 'T-shirt Size',
    mlh: true,
    required: false,
    type: questionType.dropdown,
    answerChoices: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    id: '18',
  },
  {
    title: 'Shipping Address',
    mlh: true,
    required: false,
    type: questionType.address,
    id: '19',
  },
  {
    title: 'Major/Field of Study',
    mlh: true,
    required: false,
    type: questionType.dropdown,
    answerChoices: [
      'Computer Science',
      'Computer Engineering',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Information Technology',
      'Information Systems',
      'Cybersecurity',
      'Other Engineering',
    ],
    id: '20',
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
          type: questionType.radio,
          answerChoices: [],
          required: false,
          mlh: false,
          id: uuidv4(),
        },
      ];
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <>
      <Stack gap='md' align='center' justify='flex-start'>
        <Box w={rem(500)}>
          <input placeholder='Untitled Form' className={classes.title} />
        </Box>
      </Stack>

      <Accordion
        transitionDuration={500}
        classNames={{
          label: accordionClasses.label,
          panel: accordionClasses.panel,
        }}
      >
        {includeMLH ? (
          <Accordion.Item key='MLH' value='MLH Questions'>
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
              MLH Questions
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap='md' align='center' justify='flex-start'>
                {questions.map((q: question) =>
                  q.mlh ? <MLHQuestion key={q.id} question={q} /> : null
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
              sensors={sensors}
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
                      !q.mlh ? (
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
          label='Include MLH Questions'
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
