import { useEffect, useState } from 'react';
import { Question as QuestionInterface, Choice } from '@/types/forms';
import {
  TextInput,
  Textarea,
  Select,
  Checkbox,
  Stack,
  Text,
  Radio,
  FileInput,
} from '@mantine/core';
import { uploadFile, deleteFile } from '@/app/actions/Forms';
import { UseFormReturnType } from '@mantine/form';
import { questionType } from '@/types/questionTypes';
import { ShortResponseLength, MaxParagraphLength } from '@/types/forms';

export function ShortResponse({
  question,
  disabled,
  form,
}: {
  question: QuestionInterface;
  disabled: boolean;
  form: UseFormReturnType<Record<string, any>>;
}) {
  const [response, setResponse] = useState<string>('');
  const handleChange = (e: any) => {
    const val = e.target.value;
    if (val.length > ShortResponseLength) {
      return;
    }
    setResponse(val);
    form.setFieldValue(question.key, val);
  };

  useEffect(() => {
    const values = form.getValues();
    setResponse(values[question.key] ?? '');
  }, [form]);

  return (
    <TextInput
      id={question.key}
      label={question.title}
      description={question.description}
      required={question.settings.required}
      placeholder={question.placeholder ?? 'Enter response'}
      disabled={disabled}
      {...form.getInputProps(question.key)}
      onChange={handleChange}
      value={response}
    />
  );
}

export function Phone({
  question,
  disabled,
  form,
}: {
  question: QuestionInterface;
  disabled: boolean;
  form: UseFormReturnType<Record<string, any>>;
}) {
  const [phone, setPhone] = useState('');
  const handlePhoneChange = (e: any) => {
    const value = e.target.value;

    if (value.length > 10) return;
    if (!/^\d*$/.test(value)) return;

    setPhone(value);
    form.setFieldValue(question.key, value);
  };

  useEffect(() => {
    const values = form.getValues();
    setPhone(values[question.key] ?? '');
  }, [form]);

  return (
    <TextInput
      id={question.key}
      label={question.title}
      description={question.description}
      placeholder='Phone Number'
      disabled={disabled}
      style={{ width: '9rem' }}
      required={question.settings.required}
      {...form.getInputProps(question.key)}
      onChange={handlePhoneChange}
      value={phone}
    />
  );
}

export function Paragraph({
  question,
  disabled,
  form,
}: {
  question: QuestionInterface;
  disabled: boolean;
  form: UseFormReturnType<Record<string, any>>;
}) {
  const [totalChars, setTotalChars] = useState<number>(0);
  const [response, setResponse] = useState<string>('');
  const maxChars = question.settings.maxChars ?? 500;

  const handleChange = (e: any) => {
    const value = e.target.value;
    const length = value.length;
    setTotalChars(length);
    if (value.length >= MaxParagraphLength) {
      return;
    }
    setResponse(value);
    form.setFieldValue(question.key, value);
    if (length > maxChars) {
      form.setFieldError(question.key, 'Exceeded maximum character limit');
    }
  };

  useEffect(() => {
    const values = form.getValues();
    const resp = values[question.key] ?? '';
    setTotalChars(resp.length);
    setResponse(resp);
  }, [form]);

  return (
    <div className='flex flex-col gap-1'>
      <Textarea
        id={question.key}
        label={question.title}
        description={question.description}
        required={question.settings.required}
        placeholder={question.placeholder ?? 'Enter response'}
        resize='vertical'
        disabled={disabled}
        {...form.getInputProps(question.key)}
        onChange={handleChange}
        value={response}
      />
      <p className='text-sm text-[var(--mantine-color-dimmed)]'>
        {totalChars}/{maxChars} characters
      </p>
    </div>
  );
}

export function MultipleChoice({
  question,
  disabled,
  form,
}: {
  question: QuestionInterface;
  disabled: boolean;
  form: UseFormReturnType<Record<string, any>>;
}) {
  return (
    <Radio.Group
      id={question.key}
      label={question.title}
      description={question.description}
      required={question.settings.required}
      key={form.key(question.key)}
      {...form.getInputProps(question.key)}
      styles={{
        error: {
          marginTop: '8px',
        },
      }}
    >
      <Stack className='mt-2'>
        {question.choices?.map((choice: Choice) => {
          return (
            <Radio
              id={question.key}
              key={choice.key}
              label={choice.value}
              value={choice.value}
              disabled={disabled}
            />
          );
        })}
      </Stack>
    </Radio.Group>
  );
}

export function FormCheckbox({
  question,
  disabled,
  form,
}: {
  question: QuestionInterface;
  disabled: boolean;
  form: UseFormReturnType<Record<string, any>>;
}) {
  return (
    <Checkbox.Group
      id={question.key}
      label={question.title}
      description={question.description}
      required={question.settings.required}
      key={form.key(question.key)}
      {...form.getInputProps(question.key, { type: 'checkbox' })}
      styles={{
        error: {
          marginTop: '8px',
        },
      }}
    >
      <Stack className='mt-2'>
        {question.choices?.map((choice: Choice) => {
          return (
            <Checkbox
              id={question.key}
              key={choice.key}
              label={choice.value}
              value={choice.value}
              disabled={disabled}
            />
          );
        })}
      </Stack>
    </Checkbox.Group>
  );
}

export function Dropdown({
  question,
  disabled,
  form,
}: {
  question: QuestionInterface;
  disabled: boolean;
  form: UseFormReturnType<Record<string, any>>;
}) {
  const data = question.choices?.map((choice: Choice) => choice.value) ?? [];
  return (
    <Select
      id={question.key}
      label={question.title}
      description={question.description}
      required={question.settings.required}
      placeholder={question.placeholder ?? 'Select an option'}
      data={data}
      disabled={disabled}
      key={form.key(question.key)}
      {...form.getInputProps(question.key)}
      searchable
    />
  );
}

export function Agreement({
  question,
  disabled,
  form,
}: {
  question: QuestionInterface;
  disabled: boolean;
  form: UseFormReturnType<Record<string, any>>;
}) {
  const label = (
    <p>
      {question.title}
      {question.settings.required ? (
        <span className='text-red-500'> *</span>
      ) : null}
    </p>
  );
  return (
    <Checkbox
      id={question.key}
      label={label}
      description={question.description}
      required={question.settings.required}
      key={form.key(question.key)}
      disabled={disabled}
      {...form.getInputProps(question.key, { type: 'checkbox' })}
    />
  );
}

export function FileUpload({
  competitionCode,
  formId,
  responseId,
  question,
  disabled,
  form,
}: {
  competitionCode: string;
  formId: string;
  responseId: string;
  question: QuestionInterface;
  disabled: boolean;
  form: UseFormReturnType<Record<string, any>>;
}) {
  const [file, setFile] = useState<File | null>(null);

  const stringToBytes = (str: string) => {
    switch (str) {
      case '1KB':
        return 1024;
      case '1MB':
        return 1024 * 1024;
      case '10MB':
        return 10 * 1024 * 1024;
      case '100MB':
        return 100 * 1024 * 1024;
      case '1GB':
        return 1024 * 1024 * 1024;
      default:
        return 0;
    }
  };

  const handleFileChange = async (file: File | null) => {
    if (
      file &&
      file.size > stringToBytes(question.settings.maxFileSize ?? '1MB')
    ) {
      setFile(null);
      form.setFieldError(
        question.key,
        `File size exceeds ${question.settings.maxFileSize}`
      );
      return;
    }
    setFile(file);
    if (!file) {
      await deleteFile(form.getValues()[question.key].url);
      form.setFieldValue(question.key, { url: '', value: '' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    const resp = await uploadFile(
      competitionCode,
      formId,
      responseId,
      question.key,
      formData
    );
    if (!resp) {
      console.error('Failed to upload file');
      return;
    }

    form.setFieldValue(question.key, { url: resp.url, value: file.name });
    console.log('file saved');
  };

  useEffect(() => {
    const values = form.getValues();

    const filename = values[question.key]?.value;
    if (filename) {
      setFile(new File([], filename));
    }
  }, [form]);

  return (
    <Stack gap='sm'>
      <FileInput
        id={question.key}
        accept='image/png,image/jpeg'
        label={question.title}
        description={question.description}
        required={question.settings.required}
        placeholder={file?.name || 'Upload files'}
        disabled={disabled}
        key={form.key(question.key)}
        {...form.getInputProps(question.key)}
        value={file}
        onChange={handleFileChange}
        clearable={!disabled}
      />
      {file ? (
        <Text size='sm' ta='center'>
          Picked file: {file.name}
        </Text>
      ) : null}
    </Stack>
  );
}

export function Question({
  question,
  competitionCode,
  formId,
  responseId,
  form,
  disabled,
}: {
  question: QuestionInterface;
  competitionCode: string;
  formId: string;
  responseId: string;
  form: UseFormReturnType<Record<string, any>>;
  disabled: boolean;
}) {
  switch (question.type) {
    case questionType.shortResponse:
    case questionType.email:
      return (
        <ShortResponse question={question} disabled={disabled} form={form} />
      );
    case questionType.paragraph:
      return <Paragraph question={question} disabled={disabled} form={form} />;
    case questionType.multiplechoice:
      return (
        <MultipleChoice question={question} disabled={disabled} form={form} />
      );
    case questionType.checkbox:
      return (
        <FormCheckbox question={question} disabled={disabled} form={form} />
      );
    case questionType.dropdown:
      return <Dropdown question={question} disabled={disabled} form={form} />;
    case questionType.agreement:
      return <Agreement question={question} disabled={disabled} form={form} />;
    case questionType.phone:
      return <Phone question={question} disabled={disabled} form={form} />;
    case questionType.file:
      return (
        <FileUpload
          competitionCode={competitionCode}
          formId={formId}
          responseId={responseId}
          question={question}
          disabled={disabled}
          form={form}
        />
      );
    default:
      return <h1 key={form.key(question.key)}>Not implemented yet</h1>;
  }
}
