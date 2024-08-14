import { createContext, useContext } from 'react';
import {
  Stack,
  Select,
  Switch,
  Divider,
  Tooltip,
  NumberInput,
  TextInput,
  Button,
  MultiSelect,
} from '@mantine/core';
import { questionType } from '@/types/questionTypes';
import {
  Question as FormQuestion,
  fileTypes,
  fileSizes,
  Choice,
} from '@/types/forms';
import { IconTrash, IconX } from '@tabler/icons-react';
import { v4 as uuidv4 } from 'uuid';
import { FormCreatorContext } from '@/components/formCreator/FormCreator';

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
  removeQuestion,
  disabled,
}: {
  question: FormQuestion;
  setQuestion: (value: FormQuestion) => void;
  removeQuestion: () => void;
  disabled: boolean;
}) {
  const handleRequiredChange = (e: any) => {
    setQuestion({
      ...question,
      settings: { ...question.settings, required: e.target.checked },
    });
  };

  const handleMaxWordsChange = (e: any) => {
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
          defaultValue={question.settings.maxChars ?? 1000}
          min={1}
          max={10000}
          disabled={disabled}
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
            defaultValue={question.settings.acceptedFiles}
            onChange={handleAcceptedFilesChange}
            disabled={disabled}
            clearable
          />
          <Select
            label='Max File Size'
            data={fileSizes}
            defaultValue={question.settings.maxFileSize}
            disabled={disabled}
            onChange={handleMaxFileSizeChange}
          />
        </>
      ) : null}

      <div className='relative grid grid-cols-2 items-center'>
        <Switch
          label='Required'
          defaultChecked={question.settings.required}
          onChange={handleRequiredChange}
          disabled={disabled}
          labelPosition='left'
        />
        {disabled ? null : (
          <Tooltip label='Delete question' color='gray'>
            <button
              className='flex h-8 w-8 flex-row items-center justify-center justify-self-end rounded-full transition-colors duration-300 hover:bg-stone-600'
              onClick={removeQuestion}
            >
              <IconTrash />
            </button>
          </Tooltip>
        )}
      </div>
    </Stack>
  );
}

function Choices({
  question,
  setQuestion,
  disabled,
}: {
  question: FormQuestion;
  setQuestion: (value: FormQuestion) => void;
  disabled: boolean;
}) {
  const handleAddChoice = () => {
    setQuestion({
      ...question,
      choices: [...(question.choices ?? []), { key: uuidv4(), value: '' }],
    });
  };

  const handleRemoveChoice = (index: string) => {
    setQuestion({
      ...question,
      choices: question.choices?.filter(
        (choice: Choice) => choice.key !== index
      ),
    });
  };

  const handleChoiceChange = (key: string, value: string) => {
    setQuestion({
      ...question,
      choices: question.choices?.map((choice: Choice) => {
        if (choice.key !== key) return choice;
        return { ...choice, value: value };
      }),
    });
  };

  if (
    question.type === questionType.multiplechoice ||
    question.type === questionType.checkbox ||
    question.type === questionType.dropdown
  ) {
    return (
      <Stack align='left'>
        <Divider my='md' label='Choices' />
        {question.choices?.map((choice: Choice) => {
          return (
            <div className='flex flex-row items-center' key={choice.key}>
              <TextInput
                styles={{ root: { flexGrow: 1 } }}
                defaultValue={choice.value}
                onChange={(e) => handleChoiceChange(choice.key, e.target.value)}
                disabled={disabled}
              />
              {disabled ? null : (
                <button onClick={() => handleRemoveChoice(choice.key)}>
                  <IconX stroke={1} />
                </button>
              )}
            </div>
          );
        })}
        <Button variant='light' onClick={handleAddChoice} disabled={disabled}>
          Add Choice
        </Button>
      </Stack>
    );
  }

  return null;
}

export default function QuestionEdit({
  question,
  setQuestion,
  removeQuestion,
}: {
  question: FormQuestion;
  setQuestion: (value: FormQuestion) => void;
  removeQuestion: () => void;
}) {
  const { form, _, errors, setErrors, ...other } =
    useContext(FormCreatorContext);
  const isError = errors.some((q: FormQuestion) => q.key === question.key);

  const removeError = () => {
    setErrors(errors.filter((q: FormQuestion) => q.key !== question.key));
  };

  const handleTitleChange = (e: any) => {
    removeError();
    setQuestion({ ...question, title: e.target.value });
  };

  const handleDescriptionChange = (e: any) => {
    removeError();
    setQuestion({ ...question, description: e.target.value });
  };

  const handleQuestionTypeChange = (e: any) => {
    removeError();
    if (!e) return;
    const newType = getQuestionType(e);
    setQuestion({ ...question, type: newType });
  };

  return (
    <div className='flex flex-col items-start gap-1'>
      <div
        className='w-[48rem] rounded border  p-4'
        style={{ borderColor: isError ? 'red' : 'var(--mantine-color-dark-4)' }}
      >
        <TextInput
          label='Title'
          placeholder='Enter title'
          onChange={handleTitleChange}
          defaultValue={question.title}
          disabled={form.is_published}
        />
        <TextInput
          label='Description'
          placeholder='Enter description'
          onChange={handleDescriptionChange}
          defaultValue={question.description}
          disabled={form.is_published}
        />
        <Select
          label='Type'
          data={Object.values(questionType)}
          defaultValue={question.type}
          onChange={handleQuestionTypeChange}
          disabled={form.is_published}
        />
        <Choices
          disabled={form.is_published}
          question={question}
          setQuestion={setQuestion}
        />
        <Divider my='md' label='Settings' />
        <QuestionSettings
          disabled={form.is_published}
          question={question}
          removeQuestion={removeQuestion}
          setQuestion={setQuestion}
        />
      </div>
      {isError ? (
        <p className='text-sm text-red-500'>
          {errors.find((q: FormQuestion) => q.key === question.key)?.message}
        </p>
      ) : null}
    </div>
  );
}
