'use client';

import { useState, useEffect, useRef } from 'react';
import {
  TextInput,
  Textarea,
  Select,
  Checkbox,
  Divider,
  Stack,
  Button,
  Group,
  Text,
  Title,
  Radio,
  FileInput,
} from '@mantine/core';
import { useForm, UseFormReturnType, isEmail, isNotEmpty } from '@mantine/form';
import {
  ageChoices,
  schools,
  levelOfStudies,
  countries,
  questionType,
} from '@/types/questionTypes';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { PhoneNumberUtil } from 'google-libphonenumber';
import {
  getApplication,
  getFormResponse,
  saveResponse,
  submitResponse,
} from '@/app/actions/Forms';
import {
  Question as QuestionInterface,
  Agreement,
  FormSection,
  Application,
  ApplicationResponse,
  StatusIndicator,
} from '@/types/forms';
import { mlhQuestions, mantineForm, MantineForm } from '@/forms/application';
import { Form, Competition } from '@prisma/client';
import Status from '@/components/status';

function Question({
  question,
  form,
}: {
  question: QuestionInterface;
  form: UseFormReturnType<Record<string, any>>;
}) {
  const [file, setFile] = useState<File | null>(null);
  switch (question.type) {
    case questionType.shortResponse:
    case questionType.email:
      return (
        <TextInput
          label={question.title}
          description={question.description}
          required={question.settings.required}
          placeholder={question.placeholder ?? 'Enter response'}
          key={form.key(question.key)}
          {...form.getInputProps(question.key)}
        />
      );
    case questionType.paragraph:
      return (
        <Textarea
          label={question.title}
          description={question.description}
          required={question.settings.required}
          placeholder={question.placeholder ?? 'Enter response'}
          resize='vertical'
          key={form.key(question.key)}
          {...form.getInputProps(question.key)}
        />
      );
    case questionType.multiplechoice:
      return (
        <Radio.Group
          label={question.title}
          description={question.description}
          required={question.settings.required}
          key={form.key(question.key)}
          {...form.getInputProps(question.key)}
        >
          <Stack className='mt-2'>
            {question.choices?.map((choice: string, index: number) => {
              return <Radio key={index} label={choice} value={choice} />;
            })}
          </Stack>
        </Radio.Group>
      );

    case questionType.checkbox:
      return (
        <Checkbox.Group
          label={question.title}
          description={question.description}
          required={question.settings.required}
          key={form.key(question.key)}
          {...form.getInputProps(question.key)}
        >
          <Stack className='mt-2'>
            {question.choices?.map((choice: string, index: number) => {
              return <Checkbox key={index} label={choice} value={choice} />;
            })}
          </Stack>
        </Checkbox.Group>
      );

    case questionType.dropdown:
      return (
        <Select
          label={question.title}
          description={question.description}
          required={question.settings.required}
          placeholder={question.placeholder ?? 'Select an option'}
          data={question.choices}
          key={form.key(question.key)}
          {...form.getInputProps(question.key)}
          searchable
        />
      );

    case questionType.agreement:
      return (
        <Checkbox
          label={question.title}
          description={question.description}
          required={question.settings.required}
          key={form.key(question.key)}
          {...form.getInputProps(question.key, { type: 'checkbox' })}
        />
      );
    case questionType.phone:
      return (
        <div key={question.key}>
          <Text size='sm'>
            {question.title}{' '}
            <span className='text-[var(--mantine-color-red-8)]'> *</span>
          </Text>
          <PhoneInput
            defaultCountry='us'
            placeholder='Enter your phone number'
          />
        </div>
      );
    case questionType.file:
      return (
        <Stack gap='sm'>
          <FileInput
            accept='image/png,image/jpeg'
            label={question.title}
            description={question.description}
            required={question.settings.required}
            placeholder='Upload files'
            value={file}
            onChange={setFile}
          />
          {file && (
            <Text size='sm' ta='center'>
              Picked file: {file.name}
            </Text>
          )}
        </Stack>
      );
    default:
      return <h1 key={form.key(question.key)}>Not implemented yet</h1>;
  }
}

function Section({
  section,
  form,
}: {
  section: FormSection;
  form: UseFormReturnType<Record<string, any>>;
}) {
  return (
    <>
      {/* Title and description */}
      <Title order={1}>{section.title}</Title>
      {section.description ? <Text>{section.description}</Text> : null}
      <Divider my='md' />

      {/* Questions */}
      <Stack>
        {section.questions.map((question: QuestionInterface) => {
          return (
            <Question key={question.key} question={question} form={form} />
          );
        })}
      </Stack>
    </>
  );
}

function arrayEquals(a: string[], b: string[]) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function recordEquals(a: Record<string, any>, b: Record<string, any>) {
  // Compare the keys
  if (!arrayEquals(Object.keys(a), Object.keys(b))) return false;

  for (const key in a) {
    if (
      Array.isArray(a[key]) &&
      Array.isArray(b[key]) &&
      !arrayEquals(a[key], b[key])
    )
      return false;
    else if (b[key] !== a[key]) return false;
  }

  return true;
}

export default function ViewForm({ params }: { params: { formId: string } }) {
  const phoneUtil = PhoneNumberUtil.getInstance();
  const [isValid, setIsValid] = useState(false);
  const [status, setStatus] = useState<StatusIndicator>(
    StatusIndicator.LOADING
  );
  const [formSections, setFormSections] = useState<FormSection[]>([]);
  const prevValues = useRef<Record<string, any>>({});
  const responseId = useRef<string>('');
  const autosaveTimer = useRef<NodeJS.Timeout | null>(null);
  const [phone, setPhone] = useState('');
  const userId = 'test-user';

  const form = useForm<Record<string, any>>({
    mode: 'uncontrolled',
    initialValues: {},
  });

  useEffect(() => {
    getApplication('SWAMPHACKS-X').then((resp) => {
      console.log(resp);
      if (!resp || !resp.application?.sections) {
        return;
      }
      const application: Form = resp.application;
      const sections = resp.application.sections as unknown as FormSection[];
      setFormSections(sections);

      getFormResponse(application.id, 'test-user', prevValues).then((resp) => {
        responseId.current = resp.id;
        const values = resp.answers as unknown as Record<string, any>;
        prevValues.current = values;
        form.setValues(values);
        console.log(values);
        setStatus(StatusIndicator.SUCCESS);
      });

      // Autosave every 3 seconds
      autosaveTimer.current = setInterval(async () => {
        try {
          const currentValues = form.getValues();
          if (!recordEquals(prevValues.current, currentValues)) {
            await saveResponse(responseId.current, currentValues);
            prevValues.current = currentValues;
            setStatus(StatusIndicator.SUCCESS);
            console.log('Autosaved');
          } else {
            console.log('no changes - not saved');
          }
        } catch (error) {
          console.log(error);
          setStatus(StatusIndicator.FAILED);
        }
      }, 3000);
    });

    return () => {
      if (autosaveTimer.current) {
        clearInterval(autosaveTimer.current);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isPhoneValid = (phone: string) => {
    try {
      return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
    } catch (error) {
      console.log(phone);
      console.log('not valid phone number');
      return false;
    }
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    form.setFieldValue('phoneNumber', value);
  };

  const handleSubmit = (values: any) => {};

  return (
    <form onSubmit={handleSubmit}>
      <div className='flex flex-col items-center'>
        <div className='m-[5rem] grid w-[40rem] grid-cols-1 gap-4'>
          {/* Form status */}
          <div className='justify-self-end'>
            <Status status={status} />
          </div>

          {/* Form sections */}
          <Section section={mlhQuestions.general} form={form} />
          {formSections.map((section: FormSection) => {
            return <Section key={section.key} section={section} form={form} />;
          })}
          <Section section={mlhQuestions.agreements} form={form} />
        </div>
      </div>
    </form>
  );
}
