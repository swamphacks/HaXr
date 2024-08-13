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
  Modal,
  Alert,
  NumberInput,
} from '@mantine/core';
import { IconInfoCircle, IconX } from '@tabler/icons-react';
import { useForm, UseFormReturnType } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
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
  uploadFile,
  deleteFile,
} from '@/app/actions/Forms';
import {
  Question as QuestionInterface,
  Agreement,
  FormSection,
  Application,
  ApplicationResponse,
  StatusIndicator,
  shortAnswerLength,
  Choice,
} from '@/types/forms';
import { mlhQuestions, mantineForm, MantineForm } from '@/forms/application';
import { Form, Competition } from '@prisma/client';
import Status from '@/components/status';
import { isValidEmail, initializeQuestion, isEmpty } from '@/utils/forms';

function Question({
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
  const [file, setFile] = useState<File | null>(null);
  const [phone, setPhone] = useState('');

  const handlePhoneChange = (e: any) => {
    const value = e.target.value;

    if (value.length > 10) return;
    if (!/^\d*$/.test(value)) return;

    setPhone(value);
    form.setFieldValue(question.key, value);
  };

  const handleFileChange = async (file: File | null) => {
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

    setPhone(values[question.key] ?? '');
  }, [form]);

  switch (question.type) {
    case questionType.shortResponse:
    case questionType.email:
      return (
        <TextInput
          id={question.key}
          label={question.title}
          description={question.description}
          required={question.settings.required}
          placeholder={question.placeholder ?? 'Enter response'}
          disabled={disabled}
          key={form.key(question.key)}
          {...form.getInputProps(question.key)}
        />
      );
    case questionType.paragraph:
      return (
        <Textarea
          id={question.key}
          label={question.title}
          description={question.description}
          required={question.settings.required}
          placeholder={question.placeholder ?? 'Enter response'}
          resize='vertical'
          disabled={disabled}
          key={form.key(question.key)}
          {...form.getInputProps(question.key)}
        />
      );
    case questionType.multiplechoice:
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

    case questionType.checkbox:
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

    case questionType.dropdown:
      const data =
        question.choices?.map((choice: Choice) => choice.value) ?? [];
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

    case questionType.agreement:
      return (
        <Checkbox
          id={question.key}
          label={question.title}
          description={question.description}
          required={question.settings.required}
          key={form.key(question.key)}
          disabled={disabled}
          {...form.getInputProps(question.key, { type: 'checkbox' })}
        />
      );
    case questionType.phone:
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
    case questionType.file:
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
            clearable
          />
          {file ? (
            <Text size='sm' ta='center'>
              Picked file: {file.name}
            </Text>
          ) : null}
        </Stack>
      );
    default:
      return <h1 key={form.key(question.key)}>Not implemented yet</h1>;
  }
}

function Section({
  section,
  form,
  submitted,
  competitionCode,
  formId,
  responseId,
}: {
  section: FormSection;
  form: UseFormReturnType<Record<string, any>>;
  competitionCode: string;
  formId: string;
  responseId: string;
  submitted: boolean;
}) {
  return (
    <div>
      {/* Title and description */}
      <div className='mb-[8px] flex flex-col'>
        <Title order={2}>{section.title}</Title>
        {section.description ? <Text>{section.description}</Text> : null}
        <Divider my='md' />
      </div>

      {/* Questions */}
      <Stack>
        {section.questions.map((question: QuestionInterface) => {
          return (
            <Question
              key={question.key}
              question={question}
              competitionCode={competitionCode}
              formId={formId}
              responseId={responseId}
              form={form}
              disabled={submitted}
            />
          );
        })}
      </Stack>
    </div>
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
    else {
      if (b[key] !== a[key]) return false;
    }
  }

  return true;
}

export default function ViewForm({ params }: { params: { formId: string } }) {
  const phoneUtil = PhoneNumberUtil.getInstance();
  const [isValid, setIsValid] = useState(false);
  const [modalOpened, { open, close }] = useDisclosure(false);
  const [status, setStatus] = useState<StatusIndicator>(
    StatusIndicator.LOADING
  );
  const [formSections, setFormSections] = useState<FormSection[]>([]);
  const [formObject, setFormObject] = useState<Form>();
  const [submitted, setSubmitted] = useState(false);
  const [loadingVisible, { toggle }] = useDisclosure(false);
  const submittedRef = useRef(false);
  const prevValues = useRef<Record<string, any>>({});
  const responseId = useRef<string>('');
  const [loadedForm, setLoadedForm] = useState<boolean>();
  const [phone, setPhone] = useState('');
  const userId = 'test-user';

  const form = useForm<Record<string, any>>({
    mode: 'uncontrolled',
    initialValues: {},
  });

  const autosave = async () => {
    if (submittedRef.current) {
      console.log(submittedRef.current);
      return;
    }

    try {
      const currentValues = form.getValues();
      const prev = prevValues.current;
      const currId = responseId.current;

      // Only save if there are changes
      if (!recordEquals(prev, currentValues)) {
        await saveResponse(currId, currentValues);
        prevValues.current = currentValues;
        setStatus(StatusIndicator.SUCCESS);
        console.log('Autosaved');
      }
    } catch (error) {
      console.log(error);
      setStatus(StatusIndicator.FAILED);
    }

    if (!submittedRef.current) {
      setTimeout(autosave, 1000);
    }
  };

  useEffect(() => {
    getApplication('SWAMPHACKS-X').then((resp) => {
      console.log(resp);
      if (!resp || !resp.application?.sections) {
        setStatus(StatusIndicator.FAILED);
        setLoadedForm(false);
        return;
      }
      const application: Form = resp.application;
      console.log(application);
      setFormObject(application);
      const sections = resp.application.sections as unknown as FormSection[];
      setFormSections(sections);

      getFormResponse(application.id, 'test-user', prevValues).then((resp) => {
        const responses = resp.answers as unknown as Record<string, any>;
        const transformed: Record<string, any> = {};
        responseId.current = resp.id;
        sections
          .flatMap((section: FormSection) => section.questions)
          .forEach((question: QuestionInterface) =>
            initializeQuestion(question, responses, transformed)
          );

        if (application.is_mlh) {
          mlhQuestions.general.questions.forEach(
            (question: QuestionInterface) => {
              initializeQuestion(question, responses, transformed);
            }
          );
          mlhQuestions.agreements.questions.forEach(
            (question: QuestionInterface) => {
              initializeQuestion(question, responses, transformed);
            }
          );
        }

        prevValues.current = transformed;
        form.setValues(transformed);
        console.log(transformed);

        if (!resp.submitted) {
          // Autosave every second
          setStatus(StatusIndicator.SUCCESS);
          setTimeout(autosave, 1000);
        } else {
          setStatus(StatusIndicator.SUBMITTED);
        }
        setSubmitted(resp.submitted);
        submittedRef.current = resp.submitted;
      });
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isPhoneValid = (phone: string) => {
    // if (phoneString.length !== 10) return false;
    // const phoneDash = phoneString.slice(0, 3) + '-' + phoneString.slice(3, 6) + '-' + phoneString.slice(6);
    // console.log(phoneDash);
    try {
      const number = phoneUtil.parseAndKeepRawInput(phone, 'US');
      return phoneUtil.isValidNumber(number);
    } catch (error) {
      console.log('not valid phone number');
      return false;
    }
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    form.setFieldValue('phoneNumber', value);
  };

  const validateInputs = () => {
    const values = form.getValues();
    const errors: Record<string, any> = {};
    Object.entries(values).forEach(([questionKey, response]) => {
      let question = formSections
        .flatMap((section) => section.questions)
        .find((q) => q.key === questionKey);

      if (!question && !formObject?.is_mlh) return;
      if (!question && formObject?.is_mlh) {
        question =
          mlhQuestions.general.questions.find(
            (question: QuestionInterface) => question.key === questionKey
          ) ||
          mlhQuestions.agreements.questions.find(
            (question: QuestionInterface) => question.key === questionKey
          );
      }

      if (!question) return;
      if (!response && !question.settings.required) {
        return;
      }

      switch (question.type) {
        case questionType.email:
          if (isEmpty(response) && question.settings.required) {
            errors[questionKey] = 'Please enter an email';
          }
          if (!isValidEmail(response)) {
            errors[questionKey] = 'Invalid email';
          }
          break;
        case questionType.phone:
          if (isEmpty(response) && question.settings.required) {
            errors[questionKey] = 'Please enter an email';
          }
          if (!isPhoneValid(response)) {
            errors[questionKey] = 'Invalid phone number';
          }
          break;
        case questionType.paragraph:
        case questionType.shortResponse:
          if (isEmpty(response) && question.settings.required) {
            errors[questionKey] = 'Please enter a response';
          }
          if (
            response.length > (question.settings?.maxChars ?? shortAnswerLength)
          ) {
            errors[questionKey] = 'Response is too long';
          }
          break;
        case questionType.dropdown:
        case questionType.multiplechoice:
          if (
            question.choices &&
            !question.choices.map((choice) => choice.value).includes(response)
          ) {
            errors[questionKey] = 'Please select a valid choice';
          }
          break;
        case questionType.checkbox:
          if (
            (!Array.isArray(response) || response.length === 0) &&
            question.settings.required
          ) {
            errors[questionKey] = 'Please select at least one option';
          }
          break;
        case questionType.agreement:
          if (!response && question.settings.required) {
            errors[questionKey] = 'Please agree to the terms';
          }
          break;
        case questionType.file:
          if (isEmpty(response?.value ?? '')) {
            errors[questionKey] = 'Please upload a file';
          }
          break;
      }

      // if (question.type === questionType.phone) {
      // 	if (!isPhoneValid(response)) {
      // 		errors[questionKey] = 'Invalid phone number';
      // 	}
      // }
    });

    form.setErrors(errors);

    // Scroll to first error
    let foundError = false;
    for (const question of mlhQuestions.general.questions) {
      if (question.key in errors) {
        document
          .getElementById(question.key)
          ?.scrollIntoView({ behavior: 'smooth' });
        foundError = true;
        break;
      }
    }

    for (const question of formSections.flatMap(
      (section: FormSection) => section.questions
    )) {
      if (foundError) break;
      if (question.key in errors) {
        document
          .getElementById(question.key)
          ?.scrollIntoView({ behavior: 'smooth' });
        foundError = true;
        break;
      }
    }

    for (const question of mlhQuestions.agreements.questions) {
      if (foundError) break;
      if (question.key in errors) {
        document
          .getElementById(question.key)
          ?.scrollIntoView({ behavior: 'smooth' });
        foundError = true;
        break;
      }
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    const success = validateInputs();
    if (!success) {
      return;
    }
    submittedRef.current = true; // Stop autosave
    const resp = await submitResponse(responseId.current, form.getValues());
    setSubmitted(true);
    setStatus(StatusIndicator.SUBMITTED);
    console.log(resp);
  };

  return (
    <>
      <div className='my-16 grid grid-cols-[auto_40rem_auto] items-center'>
        <div />
        {loadedForm !== false ? (
          <form onSubmit={handleSubmit}>
            {/* Submission Modal */}
            <Modal opened={modalOpened} onClose={close} title='Submit Form'>
              <Text style={{ marginBottom: '12px' }}>
                Are you sure you want to submit your application? You will not
                be able to edit it after submission.
              </Text>
              <Group justify='center'>
                <Button
                  color='green'
                  variant='light'
                  onClick={() => {
                    handleSubmit();
                    close();
                  }}
                >
                  Submit
                </Button>
              </Group>
            </Modal>

            <div />
            {formObject ? (
              <div className='flex flex-col items-center gap-8'>
                <div className='mb-8 grid w-full grid-cols-2'>
                  {/* Title */}
                  <Title order={1}>{formObject?.title}</Title>

                  {/* Form status */}
                  <div className='justify-self-end'>
                    <Status status={status} />
                  </div>
                </div>

                {/* Form sections */}
                <div className='flex w-full flex-col gap-8'>
                  {formObject.is_mlh ? (
                    <Section
                      section={mlhQuestions.general}
                      form={form}
                      submitted={submitted}
                      competitionCode={formObject.competition_code}
                      formId={formObject.id}
                      responseId={responseId.current}
                    />
                  ) : null}
                  {formSections.map((section: FormSection) => {
                    return (
                      <Section
                        key={section.key}
                        section={section}
                        form={form}
                        submitted={submitted}
                        competitionCode={formObject.competition_code}
                        formId={formObject.id}
                        responseId={responseId.current}
                      />
                    );
                  })}
                  {formObject.is_mlh ? (
                    <Section
                      section={mlhQuestions.agreements}
                      form={form}
                      submitted={submitted}
                      competitionCode={formObject.competition_code}
                      formId={formObject.id}
                      responseId={responseId.current}
                    />
                  ) : null}
                </div>

                {/* Submit */}
                <Button
                  variant='light'
                  color='green'
                  onClick={open}
                  disabled={submitted}
                >
                  Submit Form
                </Button>
              </div>
            ) : (
              <div className='justify-self-end'>
                <Status status={status} />
              </div>
            )}
          </form>
        ) : (
          <div className='flex flex-col items-center justify-center'>
            <Alert
              variant='light'
              color='red'
              title='Form not found'
              icon={<IconInfoCircle />}
            >
              The form you are looking for was not found. The form may have
              closed or been deleted. If you were in the process of editing the
              form before the form closed, it has been auto-submitted. If you
              believe this is an error, please contact the event organizers.
            </Alert>
          </div>
        )}
      </div>
      <div />
    </>
  );
}
