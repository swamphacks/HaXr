'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Divider,
  Stack,
  Button,
  Group,
  Text,
  Title,
  Modal,
  Alert,
} from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useForm, UseFormReturnType } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { questionType } from '@/types/questionTypes';
import 'react-international-phone/style.css';
import { PhoneNumberUtil } from 'google-libphonenumber';
import {
  getApplication,
  getForm,
  getFormResponse,
  saveResponse,
  submitResponse,
  getUser,
} from '@/app/actions/forms';
import {
  Question as QuestionInterface,
  FormSection,
  StatusIndicator,
  ShortResponseLength,
} from '@/types/forms';
import { mlhQuestions } from '@/forms/application';
import { Form } from '@prisma/client';
import Status from '@/components/status';
import {
  isValidEmail,
  initializeQuestion,
  isEmpty,
  recordEquals,
} from '@/utils/forms';
import { Question } from '@/components/forms/Questions';
import { notifications } from '@mantine//notifications';
import { Session } from 'next-auth';

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

export default function ViewForm({
  formId,
  session,
  onApplication,
}: {
  formId: string;
  session: Session;
  onApplication: boolean;
}) {
  const phoneUtil = PhoneNumberUtil.getInstance();
  const [modalOpened, { open, close }] = useDisclosure(false);
  const [status, setStatus] = useState<StatusIndicator>(
    StatusIndicator.LOADING
  );
  const [formSections, setFormSections] = useState<FormSection[]>([]);
  const [formObject, setFormObject] = useState<Form>();
  const [submitted, setSubmitted] = useState(false);
  const submittedRef = useRef(false);
  const prevValues = useRef<Record<string, any>>({});
  const responseId = useRef<string>('');
  const userId = useRef<string>('');
  const [loadedForm, setLoadedForm] = useState<boolean>();

  const form = useForm<Record<string, any>>({
    mode: 'uncontrolled',
    initialValues: {},
  });

  const isPhoneValid = (phone: string) => {
    try {
      const umber = phoneUtil.parseAndKeepRawInput(phone, 'US');
      return phoneUtil.isValidNumber(number);
    } catch (error) {
      console.log('not valid phone number');
      return false;
    }
  };

  const validateInputs = (
    responses: Record<string, any>,
    scrollToError: boolean = true
  ) => {
    const errors: Record<string, any> = {};
    Object.entries(responses).forEach(([questionKey, response]) => {
      // find associated question
      let question = formSections
        .flatMap((section) => section.questions)
        .find((q) => q.key === questionKey);

      // If no question is found and this is not an MLH form, the response has nothing to be validated against - this case should not happen
      if (!question && !formObject?.is_mlh) return;

      // If no question is found and this is an MLH form, check the MLH questions
      if (!question && formObject?.is_mlh) {
        question =
          mlhQuestions.general.questions.find(
            (question: QuestionInterface) => question.key === questionKey
          ) ||
          mlhQuestions.agreements.questions.find(
            (question: QuestionInterface) => question.key === questionKey
          );
      }

      if (!question) return; // No question is associated - return
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
            errors[questionKey] = 'Please enter a phone number';
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
            response.length >
            (question.settings?.maxChars ?? ShortResponseLength)
          ) {
            errors[questionKey] = 'Exceeded maximum character limit';
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
            errors[questionKey] = 'Please agree';
          }
          break;
        case questionType.file:
          // Existing error should already exist if file size is too large
          if (questionKey in form.errors)
            errors[questionKey] = form.errors[questionKey];
          else if (isEmpty(response?.value ?? '')) {
            errors[questionKey] = 'Please upload a file';
          }
          break;
      }
    });

    form.setErrors(errors);
    if (scrollToError) {
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
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    const success = validateInputs(form.getValues());
    if (!success) {
      return;
    }
    submittedRef.current = true; // Stop autosave
    const resp = await submitResponse(
      userId.current,
      responseId.current,
      form.getValues()
    );

    if (!resp) {
      setStatus(StatusIndicator.FAILED);
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'There was an error submitting your form.',
      });
      return;
    }

    setSubmitted(true);
    setStatus(StatusIndicator.SUBMITTED);
    notifications.show({
      color: 'green',
      title: 'Success!',
      message: 'The form was successfully submitted.',
    });
    console.log(resp);
  };

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
        await saveResponse(userId.current, currId, currentValues);
        prevValues.current = currentValues;
        console.log(currentValues);
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
    const formPromise: Promise<Form | null> = onApplication
      ? getApplication(formId)
      : getForm(formId);
    formPromise
      .then((application: Form | null) => {
        if (!application) {
          throw new Error('Form not found');
        }
        console.log(application);
        setFormObject(application);
        const sections = application.sections as unknown as FormSection[];
        setFormSections(sections);
        return application;
      })
      .then((application: Form) =>
        Promise.all([application, getUser(session.user?.email ?? '')])
      )
      .then(([application, user]) => {
        userId.current = user?.id ?? '';
        return Promise.all([
          application,
          getFormResponse(application.id, userId.current),
        ]);
      })
      .then(([application, resp]) => {
        if (!resp) throw new Error('Failed to get response');

        const responses = resp.values as unknown as Record<string, any>;
        const sections = application.sections as unknown as FormSection[];
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
      })
      .catch((error) => {
        console.error(error);
        setStatus(StatusIndicator.FAILED);
        setLoadedForm(false);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
