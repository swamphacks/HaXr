import { useContext } from 'react';
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
import {
  FileTypes,
  FileSizes,
  FormValidationError,
  FormContext,
  FileType,
} from '@/types/forms';
import {
  Question as FormQuestion,
  Choice,
  QuestionType,
} from '@/types/question';
import { IconTrash, IconX } from '@tabler/icons-react';
import { v4 as uuidv4 } from 'uuid';
import { FormCreatorContext } from '@/components/formCreator/FormCreator';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function getQuestionType(value: string) {
  switch (value) {
    case 'Multiple Choice':
      return QuestionType.multiplechoice;
    case 'Checkbox':
      return QuestionType.checkbox;
    case 'Dropdown':
      return QuestionType.dropdown;
    case 'Short Answer':
      return QuestionType.shortResponse;
    case 'Paragraph':
      return QuestionType.paragraph;
    case 'File Upload':
      return QuestionType.file;
    case 'Agreement':
      return QuestionType.agreement;
    case 'Phone':
      return QuestionType.phone;
    case 'Email':
      return QuestionType.email;
    default:
      console.error(
        `Invalid question type '{value}'. Defaulting to 'Paragraph'`
      );
      return QuestionType.paragraph;
  }
}

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
      {question.type === QuestionType.paragraph ||
      question.type === QuestionType.shortResponse ? (
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
      {question.type === QuestionType.file ? (
        <>
          <MultiSelect
            label='File Types'
            placeholder='Pick file types'
            data={FileTypes}
            defaultValue={question.settings.acceptedFiles}
            onChange={handleAcceptedFilesChange}
            disabled={disabled}
            clearable
          />
          <Select
            label='Max File Size'
            data={FileSizes}
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
    question.type === QuestionType.multiplechoice ||
    question.type === QuestionType.checkbox ||
    question.type === QuestionType.dropdown
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
        {!disabled && (
          <Button variant='light' onClick={handleAddChoice}>
            Add Choice
          </Button>
        )}
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
  const formContext: FormContext = useContext<FormContext>(FormCreatorContext);

  const isError = formContext.errors.some(
    (q: FormValidationError) => q.key === question.key
  );

  const removeError = () => {
    formContext.setErrors(
      formContext.errors.filter(
        (q: FormValidationError) => q.key !== question.key
      )
    );
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
    <div className='relative flex flex-col items-start gap-1'>
      <div
        className='w-[48rem] rounded border  p-4'
        style={{ borderColor: isError ? 'red' : 'var(--mantine-color-dark-4)' }}
      >
        <TextInput
          label='Title'
          placeholder='Enter title'
          onChange={handleTitleChange}
          defaultValue={question.title}
          disabled={question.mlh || formContext.form.is_published}
        />
        <TextInput
          label='Description'
          placeholder='Enter description'
          onChange={handleDescriptionChange}
          defaultValue={question.description}
          disabled={formContext.form.is_published}
        />
        <Select
          label='Type'
          data={Object.values(QuestionType)}
          defaultValue={question.type}
          onChange={handleQuestionTypeChange}
          disabled={question.mlh || formContext.form.is_published}
        />
        <Choices
          disabled={question.mlh || formContext.form.is_published}
          question={question}
          setQuestion={setQuestion}
        />
        <Divider my='md' label='Settings' />
        <QuestionSettings
          disabled={question.mlh || formContext.form.is_published}
          question={question}
          removeQuestion={removeQuestion}
          setQuestion={setQuestion}
        />
      </div>
      {isError ? (
        <p className='text-sm text-red-500'>
          {
            formContext.errors.find(
              (q: FormValidationError) => q.key === question.key
            )?.message
          }
        </p>
      ) : null}
    </div>
  );
}
