'use client';

import { useState } from 'react';
import { createTheme, Box, TextInput, Stack, Tabs, rem } from '@mantine/core';
import {
  IconPhoto,
  IconMessageCircle,
  IconSettings,
} from '@tabler/icons-react';
import Question from '@/components/admin/Question';

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
};

export default function CreateForm() {
  const iconStyle = { width: rem(12), height: rem(12) };
  const [questions, setQuestions] = useState<question[]>([
    {
      title: 'Question 1',
      type: questionType.radio,
    },
  ]);

  return (
    <Tabs defaultValue='gallery'>
      <Tabs.List justify='center'>
        <Tabs.Tab value='gallery' leftSection={<IconPhoto style={iconStyle} />}>
          Questions
        </Tabs.Tab>
        <Tabs.Tab
          value='messages'
          leftSection={<IconMessageCircle style={iconStyle} />}
        >
          Responses
        </Tabs.Tab>
        <Tabs.Tab
          value='settings'
          leftSection={<IconSettings style={iconStyle} />}
        >
          Settings
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value='gallery'>
        <Stack gap='md' align='center' justify='flex-start'>
          <Box w={rem(500)}>
            <TextInput label='Form Name' placeholder='Untitled Form' />
          </Box>
          {questions.map((q: question, index: number) => (
            <Box key={index} w={rem(500)}>
              <Question {...q} />
            </Box>
          ))}
        </Stack>
      </Tabs.Panel>

      <Tabs.Panel value='messages'>Responses tab content</Tabs.Panel>

      <Tabs.Panel value='settings'>Settings tab content</Tabs.Panel>
    </Tabs>
  );
}
