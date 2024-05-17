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
import { FormQuestion, questionType } from '@/types/questionTypes';

const requiredQuestions: FormQuestion[] = [
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
      { value: 'Under 18', id: uuidv4() },
      { value: '18-24', id: uuidv4() },
      { value: '25-34', id: uuidv4() },
      { value: '35-44', id: uuidv4() },
      { value: '45-54', id: uuidv4() },
      { value: '55-64', id: uuidv4() },
      { value: '65+', id: uuidv4() },
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
      { value: 'University of Florida', id: uuidv4() },
      { value: 'University of South Florida', id: uuidv4() },
      { value: 'Florida State University', id: uuidv4() },
      { value: 'University of Central Florida', id: uuidv4() },
      { value: 'Florida International University', id: uuidv4() },
      { value: 'Florida Atlantic University', id: uuidv4() },
      { value: 'University of Miami', id: uuidv4() },
      { value: 'Florida Gulf Coast University', id: uuidv4() },
      { value: 'Florida A&M University', id: uuidv4() },
      { value: 'Stetson University', id: uuidv4() },
      { value: 'Embry-Riddle Aeronautical University', id: uuidv4() },
      { value: 'Rollins College', id: uuidv4() },
      { value: 'Florida Institute of Technology', id: uuidv4() },
      { value: 'Other', id: uuidv4() },
    ],
    id: '6',
  },
  {
    title: 'Level of Study',
    type: questionType.multiplechoice,
    mlh: true,
    required: true,
    answerChoices: [
      { value: 'Less than Secondary / High School', id: uuidv4() },
      { value: 'Secondary / High School', id: uuidv4() },
      {
        value:
          'Undergraduate University (2 year - community college or similar)',
        id: uuidv4(),
      },
      { value: 'Undergraduate University (3+ year)', id: uuidv4() },
      {
        value: 'Graduate University (Masters, Professional, Doctoral, etc)',
        id: uuidv4(),
      },
      { value: 'Code School / Bottcamp', id: uuidv4() },
      {
        value: 'Other Vocational / Trade Program or Apprenticeship',
        id: uuidv4(),
      },
      { value: 'Post Doctorate', id: uuidv4() },
      { value: 'Other', id: uuidv4() },
      { value: "I'm not currently a student", id: uuidv4() },
      { value: 'Prefer not to answer', id: uuidv4() },
    ],
    id: '7',
  },
  {
    title: 'Country of Residence',
    type: questionType.dropdown,
    mlh: true,
    required: true,
    answerChoices: [
      { value: 'United States', id: uuidv4() },
      { value: 'Canada', id: uuidv4() },
      { value: 'United Kingdom', id: uuidv4() },
      { value: 'Australia', id: uuidv4() },
      { value: 'Germany', id: uuidv4() },
      { value: 'France', id: uuidv4() },
      { value: 'India', id: uuidv4() },
      { value: 'Netherlands', id: uuidv4() },
      { value: 'Spain', id: uuidv4() },
      { value: 'Italy', id: uuidv4() },
      { value: 'Brazil', id: uuidv4() },
      { value: 'China', id: uuidv4() },
      { value: 'Japan', id: uuidv4() },
      { value: 'South Korea', id: uuidv4() },
      { value: 'Sweden', id: uuidv4() },
      { value: 'Russia', id: uuidv4() },
      { value: 'Switzerland', id: uuidv4() },
      { value: 'Other', id: uuidv4() },
    ],
    id: '8',
  },
  {
    title:
      'I have read and agree to the MLH Code of Conduct. (https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md)',
    type: questionType.agreement,
    mlh: true,
    required: true,
    id: '9',
  },
  {
    title:
      'I authorize you to share my application/registration information with Major League Hacking for event administration, ranking, and MLH administration in-line with the MLH Privacy Policy (https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md). I further agree to the terms of both the MLH Contest Terms and Conditions (https://github.com/MLH/mlh-policies/blob/main/contest-terms.md) and the MLH Privacy Policy (https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md).',
    type: questionType.agreement,
    mlh: true,
    required: true,
    id: '10',
  },
  {
    title:
      'I authorize MLH to send me occasional emails about relevant events, career opportunities, and community announcements.',
    type: questionType.agreement,
    mlh: true,
    required: false,
    id: '0',
  },
  {
    title: 'Dietary Restrictions',
    type: questionType.checkbox,
    mlh: true,
    required: false,
    id: '11',
    answerChoices: [
      { value: 'Vegetarian', id: uuidv4() },
      { value: 'Vegan', id: uuidv4() },
      { value: 'Celiac Disease', id: uuidv4() },
      { value: 'Allergies', id: uuidv4() },
      { value: 'Kosher', id: uuidv4() },
      { value: 'Halal', id: uuidv4() },
    ],
  },
  {
    title:
      'Do you identify as part of an underrepresented group in the technology industry?',
    type: questionType.multiplechoice,
    required: false,
    mlh: true,
    id: '12',
    answerChoices: [
      { value: 'Yes', id: uuidv4() },
      { value: 'No', id: uuidv4() },
      { value: 'Unsure', id: uuidv4() },
    ],
  },
  {
    title: 'Gender',
    type: questionType.multiplechoice,
    required: false,
    mlh: true,
    answerChoices: [
      { value: 'Man', id: uuidv4() },
      { value: 'Woman', id: uuidv4() },
      { value: 'Non-Binary', id: uuidv4() },
      { value: 'Prefer Not to self-describe', id: uuidv4() },
      { value: 'Prefer Not to Answer', id: uuidv4() },
    ],
    id: '13',
  },
  {
    title: 'Pronouns',
    type: questionType.multiplechoice,
    required: false,
    mlh: true,
    answerChoices: [
      { value: 'He/Him', id: uuidv4() },
      { value: 'She/Her', id: uuidv4() },
      { value: 'They/Them', id: uuidv4() },
      { value: 'She/They', id: uuidv4() },
      { value: 'He/They', id: uuidv4() },
      { value: 'Prefer Not to Answer', id: uuidv4() },
      { value: 'Other', id: uuidv4() },
    ],
    id: '14',
  },
  {
    title: 'Race / Ethnicity',
    type: questionType.checkbox,
    required: false,
    mlh: true,
    answerChoices: [
      { value: 'American Indian or Alaska Native', id: uuidv4() },
      { value: 'Asian', id: uuidv4() },
      { value: 'Black or African American', id: uuidv4() },
      { value: 'Hispanic or Latino', id: uuidv4() },
      { value: 'Native Hawaiian or Other Pacific Islander', id: uuidv4() },
      { value: 'White', id: uuidv4() },
      { value: 'Prefer not to answer', id: uuidv4() },
      { value: 'Other', id: uuidv4() },
    ],
    id: '15',
  },
  {
    title: 'Do you consider yourself any of the following?',
    mlh: true,
    required: false,
    type: questionType.multiplechoice,
    answerChoices: [
      { value: 'Heterosexual or Straight', id: uuidv4() },
      { value: 'Gay or Lesbian', id: uuidv4() },
      { value: 'Bisexual', id: uuidv4() },
      { value: 'Other', id: uuidv4() },
      { value: 'Prefer not to answer', id: uuidv4() },
    ],
    id: '16',
  },
  {
    title:
      'What is the highest level of formal education that you have completed?',
    mlh: true,
    required: false,
    type: questionType.multiplechoice,
    answerChoices: [
      { value: 'Less than High School', id: uuidv4() },
      { value: 'High School Diploma or Equivalent', id: uuidv4() },
      { value: 'Some College', id: uuidv4() },
      { value: 'Associate Degree', id: uuidv4() },
      { value: 'Bachelor’s Degree', id: uuidv4() },
      { value: 'Master’s Degree', id: uuidv4() },
      { value: 'Professional Degree (MD, JD, etc)', id: uuidv4() },
      { value: 'Doctorate Degree', id: uuidv4() },
      { value: 'Other', id: uuidv4() },
    ],
    id: '17',
  },
  {
    title: 'T-shirt Size',
    mlh: true,
    required: false,
    type: questionType.dropdown,
    answerChoices: [
      { value: 'XS', id: uuidv4() },
      { value: 'S', id: uuidv4() },
      { value: 'M', id: uuidv4() },
      { value: 'L', id: uuidv4() },
      { value: 'XL', id: uuidv4() },
      { value: 'XXL', id: uuidv4() },
      { value: 'XXXL', id: uuidv4() },
    ],
    id: '18',
  },
  {
    title: 'Shipping Address',
    mlh: true,
    required: false,
    type: questionType.address,
    id: '19',
    addressLineOne: '',
    city: '',
    country: '',
    pincode: '',
  },
  {
    title: 'Major/Field of Study',
    mlh: true,
    required: false,
    type: questionType.dropdown,
    answerChoices: [
      { value: 'Computer Science', id: uuidv4() },
      { value: 'Computer Engineering', id: uuidv4() },
      { value: 'Electrical Engineering', id: uuidv4() },
      { value: 'Mechanical Engineering', id: uuidv4() },
      { value: 'Information Technology', id: uuidv4() },
      { value: 'Information Systems', id: uuidv4() },
      { value: 'Cybersecurity', id: uuidv4() },
      { value: 'Other Engineering', id: uuidv4() },
    ],
    id: '20',
  },
];

function FormCreator({
  questions,
  setQuestions,
  includeMLH,
}: {
  questions: FormQuestion[];
  setQuestions: any;
  includeMLH: boolean;
}) {
  const handleAddQuestions = () => {
    setQuestions((oldQuestions: FormQuestion[]) => {
      return [
        ...oldQuestions,
        {
          title: '',
          type: questionType.shortResponse,
          required: false,
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
                {questions.map((q: FormQuestion) =>
                  q.mlh ? <Question key={q.id} question={q} disabled /> : null
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
                    {questions.map((q: FormQuestion) =>
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
