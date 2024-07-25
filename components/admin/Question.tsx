import { createContext } from 'react';
import {
  Stack,
  Select,
  Switch,
  Divider,
  Tooltip,
  Checkbox,
  NumberInput,
  Textarea,
  TextInput,
  Title,
  Button,
  MultiSelect,
} from '@mantine/core';
import { questionType } from '@/types/questionTypes';
import { Question as FormQuestion, fileTypes, fileSizes } from '@/types/forms';

function getQuestionType(value: string) {
  switch (value) {
    case 'Multiple Choice':
      return questionType.multiplechoice;
    case 'Checkbox':
      return questionType.checkbox;
    case 'Dropdown':
      return questionType.dropdown;
    case 'Short Answer':
      return questionType.shortResponse;
    case 'Paragraph':
      return questionType.paragraph;
    case 'File Upload':
      return questionType.file;
    case 'Agreement':
      return questionType.agreement;
    case 'Phone':
      return questionType.phone;
    case 'Email':
      return questionType.email;
    default:
      console.error(
        `Invalid question type '{value}'. Defaulting to 'Paragraph'`
      );
      return questionType.paragraph;
  }
}

export const OtherIncludedContext = createContext({
  question: {} as FormQuestion,
  setQuestions: (value: FormQuestion[]) => {},
});

function QuestionSettings({
  question,
  setQuestion,
}: {
  question: FormQuestion;
  setQuestion: (value: FormQuestion) => void;
}) {
  const handleRequiredChange = (e: any) => {
    setQuestion({
      ...question,
      settings: { ...question.settings, required: e.target.checked },
    });
  };

  const handleMaxWordsChange = (e: any) => {
    debugger;
    const value = e;
    if (typeof value !== 'number') return;
    setQuestion({
      ...question,
      settings: { ...question.settings, maxChars: value },
    });
  };

  const handleAcceptedFilesChange = (files: string[]) => {
    // TODO: Add file type validation
    setQuestion({
      ...question,
      settings: { ...question.settings, acceptedFiles: files as any },
    });
  };

  const handleMaxFileSizeChange = (e: any) => {
    setQuestion({
      ...question,
      settings: { ...question.settings, maxFileSize: e },
    });
  };

  return (
    <Stack>
      {/* Paragraph and Short Response Settings */}
      {question.type === questionType.paragraph ||
      question.type === questionType.shortResponse ? (
        <NumberInput
          label='Maximum Characters'
          defaultValue={question.settings.maxChars ?? 1}
          min={1}
          max={10000}
          onChange={handleMaxWordsChange}
        />
      ) : null}

      {/* File Type Setting */}
      {question.type === questionType.file ? (
        <>
          <MultiSelect
            label='File Types'
            placeholder='Pick file types'
            data={fileTypes}
            onChange={handleAcceptedFilesChange}
          />
          <Select
            label='Max File Size'
            data={fileSizes}
            onChange={handleMaxFileSizeChange}
          />
        </>
      ) : null}

      <Switch
        label='Required'
        defaultChecked={question.settings.required}
        onChange={handleRequiredChange}
        labelPosition='left'
      />
    </Stack>
  );
}

function Choices({
  question,
  setQuestion,
}: {
  question: FormQuestion;
  setQuestion: (value: FormQuestion) => void;
}) {
  const handleAddChoice = () => {
    setQuestion({ ...question, choices: [...(question.choices ?? []), ''] });
  };

  const handleChoiceChange = (index: number, value: string) => {
    setQuestion({
      ...question,
      choices: question.choices?.map((choice, i) =>
        i === index ? value : choice
      ),
    });
  };

  if (
    question.type === questionType.multiplechoice ||
    question.type === questionType.checkbox ||
    question.type === questionType.dropdown
  ) {
    return (
      <>
        <Title order={3}>Answer Choices</Title>
        {question.choices?.map((choice: string, index: number) => {
          return (
            <div key={index} className='flex flex-row items-center gap-2'>
              <TextInput
                defaultValue={choice}
                onChange={(e) => handleChoiceChange(index, e.target.value)}
              />
            </div>
          );
        })}
        <Button onClick={handleAddChoice}>Add Choice</Button>
      </>
    );
  }

  return null;
}

export default function QuestionEdit({
  question,
  setQuestion,
}: {
  question: FormQuestion;
  setQuestion: (value: FormQuestion) => void;
}) {
  const handleQuestionTypeChange = (e: any) => {
    if (!e) return;
    const newType = getQuestionType(e);
    setQuestion({ ...question, type: newType });
  };

  return (
    <div className='rounded border border-white'>
      <TextInput label='Question Title' defaultValue={question.title} />
      <TextInput
        label='Question Description'
        defaultValue={question.description}
      />
      <Select
        label='Question Type'
        data={Object.values(questionType)}
        onChange={handleQuestionTypeChange}
      />
      <Choices question={question} setQuestion={setQuestion} />
      <QuestionSettings question={question} setQuestion={setQuestion} />
    </div>
  );
}
