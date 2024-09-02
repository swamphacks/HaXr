'use client';

import { useState, useContext } from 'react';
import { Button, Text, Switch, Divider, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DateTimePicker } from '@mantine/dates';
import { FormValidationError, FormContext } from '@/types/forms';
import { QuestionType, Question } from '@/types/question';
import { updateFormSettings, saveAndPublishForm } from '@/app/actions/forms';
import {
  StatusIndicator,
  FormSection,
  FileTypes,
  FileSizes,
  FormErrorTypes,
  mlhQuestions,
} from '@/types/forms';
import { IconLink } from '@tabler/icons-react';
import { Prisma, Form } from '@prisma/client';
import { FormCreatorContext } from '@/components/formCreator/FormCreator';
import { notifications } from '@mantine/notifications';
import { isEmpty } from '@/utils/forms';

export default function Settings() {
  const formContext: FormContext = useContext<FormContext>(FormCreatorContext);
  const [opened, { open, close }] = useDisclosure(false);
  const [closeDateError, setCloseDateError] = useState<{
    error: boolean;
    msg: string;
  }>({ error: false, msg: '' });
  const [openDateError, setOpenDateError] = useState({ error: false, msg: '' });

  const validateQuestions = () => {
    const errors: FormValidationError[] = [];
    const sections = formContext.form.sections as unknown as FormSection[];

    // Validate Form Title
    if (isEmpty(formContext.form.title)) {
      errors.push({
        key: '',
        type: FormErrorTypes.FormTitle,
        message: 'Form title cannot be empty',
      });
    }

    // Validate Sections
    if (sections.length === 0) {
      errors.push({
        key: '',
        type: FormErrorTypes.NoSections,
        message: 'Form must have at least one section',
      });
    }

    // Validate Section Titles
    sections.forEach((section: FormSection) => {
      const title = section.title || 'Untitled Section';
      if (isEmpty(title)) {
        errors.push({
          key: section.key,
          type: FormErrorTypes.SectionTitle,
          message: 'Section title cannot be empty',
        });
      }

      if (section.questions.length === 0) {
        errors.push({
          key: section.key,
          type: FormErrorTypes.NoQuestions,
          message: 'Section must have at least one question',
        });
      }
    });

    // Validate Questions
    sections
      .flatMap((section: FormSection) => section.questions)
      .forEach((question: Question) => {
        if (question.mlh) return;
        // Verify question title is not empty
        if (isEmpty(question.title)) {
          errors.push({
            key: question.key,
            type: FormErrorTypes.Question,
            message: 'Question title cannot be empty',
          });
          return;
        }

        if (question.type === QuestionType.file) {
          const acceptedFiles = question.settings.acceptedFiles ?? [];
          const fileSize = question.settings.maxFileSize ?? '';

          // Validate file size
          if (!FileSizes.includes(fileSize)) {
            errors.push({
              key: question.key,
              type: FormErrorTypes.Question,
              message: 'Please select a valid file size',
            });
            return;
          }

          // Validate file types
          if (acceptedFiles.length === 0) {
            errors.push({
              key: question.key,
              type: FormErrorTypes.Question,
              message: 'Please select at least one file type',
            });
            return;
          }
          for (const fileType of acceptedFiles) {
            if (!FileTypes.includes(fileType)) {
              errors.push({
                key: question.key,
                type: FormErrorTypes.Question,
                message: `File type ${fileType} is not supported`,
              });
              break;
            }
          }
        }

        // Validate choice questions
        if (
          [
            QuestionType.multiplechoice,
            QuestionType.dropdown,
            QuestionType.checkbox,
          ].includes(question.type)
        ) {
          const choices = question.choices ?? [];
          if (choices.length === 0) {
            errors.push({
              key: question.key,
              type: FormErrorTypes.Question,
              message: 'Question must have at least one choice',
            });
          }
        }
      });

    formContext.setErrors(errors);
    console.log(errors);
    return errors.length;
  };

  const handleIncludeMLH = (e: any) => {
    if (e.target.checked) {
      formContext.setForm({
        ...formContext.form,
        sections: [
          {
            key: 'mlh-general',
            title: 'General',
            questions: mlhQuestions.general
              .questions as unknown as Prisma.JsonArray[],
          },
          ...(formContext.form.sections as Prisma.JsonArray),
          {
            key: 'mlh-agreement',
            title: 'Agreements',
            questions: mlhQuestions.agreements
              .questions as unknown as Prisma.JsonArray[],
          },
        ],
        is_mlh: true,
      });
    } else {
      formContext.setForm({
        ...formContext.form,
        sections: (formContext.form.sections as Prisma.JsonArray).slice(1, -1),
        is_mlh: false,
      });
    }
  };

  const handleRequireSubmission = (e: any) => {
    formContext.setForm({
      ...formContext.form,
      required_for_checkin: e.target.checked,
    });
  };

  const validateFormSettings = (form: Form) => {
    let isValid = true;
    if (!form.closes_at) {
      setCloseDateError({ error: true, msg: 'Close date cannot be empty' });
      return false;
    }

    if (form.opens_at && form.opens_at >= form.closes_at) {
      setOpenDateError({
        error: true,
        msg: 'Release date must be before the close date',
      });
      isValid = false;
    } else {
      setOpenDateError({ error: false, msg: '' });
    }

    if (form.closes_at <= new Date()) {
      setCloseDateError({
        error: true,
        msg: 'Close date must be after the current date',
      });
      isValid = false;
    }
    if (isValid) {
      setOpenDateError({ error: false, msg: '' });
      setCloseDateError({ error: false, msg: '' });
    }
    return isValid;
  };

  const displaySettingsError = () => {
    notifications.show({
      color: 'red',
      title: 'Errors in settings.',
      message: 'Please fix the errors in the form settings before saving',
    });
  };

  const displayQuestionsError = (numErrors: number) => {
    notifications.show({
      color: 'red',
      title: 'Error validating form',
      message:
        numErrors === 1
          ? 'There is 1 error in the form. Please fix it before publishing.'
          : `There are ${numErrors} errors in the form. Please fix them before publishing.`,
    });
  };

  const validateQuestionsAndSettings = (form: Form) => {
    let isValid = true;
    const numErrors = validateQuestions();
    if (numErrors !== 0) {
      displayQuestionsError(numErrors);
      isValid = false;
    }

    if (!validateFormSettings(form)) {
      displaySettingsError();
      isValid = false;
    }

    if (!isValid) close();
    return isValid;
  };

  const handleSaveFormSettings = async (form: Form) => {
    if (formContext.autosaveTimer.current) {
      clearInterval(formContext.autosaveTimer.current);
    }

    if (validateFormSettings(form)) {
      formContext.setStatus(StatusIndicator.SAVING);
      const resp = await updateFormSettings(form);
      console.log(resp);
      formContext.setStatus(StatusIndicator.SUCCESS);
      notifications.show({
        color: 'green',
        title: 'Settings saved!',
        message: 'The settings were successfully saved',
      });
    } else {
      displaySettingsError();
    }
    formContext.autosaveTimer.current = setInterval(formContext.save, 1000);
  };

  const handleSaveAndPublish = async (form: Form) => {
    if (formContext.autosaveTimer.current) {
      clearInterval(formContext.autosaveTimer.current);
    }

    if (!validateQuestionsAndSettings(form)) {
      return;
    }

    formContext.setStatus(StatusIndicator.SAVING);
    const resp = await saveAndPublishForm(form);
    formContext.setForm({ ...form, is_published: true });
    console.log(resp);
    formContext.setStatus(StatusIndicator.SUCCESS);
    notifications.show({
      color: 'green',
      title: 'Success!',
      message: 'Form has been published successfully.',
    });

    formContext.autosaveTimer.current = setInterval(formContext.save, 1000);
    close();
  };

  const handleUnpublish = async (form: Form) => {
    if (formContext.autosaveTimer.current) {
      clearInterval(formContext.autosaveTimer.current);
    }

    formContext.setStatus(StatusIndicator.SAVING);
    const resp = await updateFormSettings({ ...form, is_published: false });
    console.log(resp);
    // DO NOT CHANGE THE ORDER OF UPDATE OTHERWISE IT BREAKS
    formContext.setForm({ ...form, is_published: false });
    formContext.setStatus(StatusIndicator.SUCCESS);
    notifications.show({
      title: 'Unpublished',
      message: 'Form has been unpublished successfully.',
    });

    formContext.autosaveTimer.current = setInterval(formContext.save, 1000);
    close();
  };

  return (
    <div className='flex flex-col items-center'>
      <Modal opened={opened} onClose={close} centered>
        {formContext.form.is_published ? (
          <>
            <Text size='md'>
              Are you sure you want to unpublish the form? <br />
              <br />
              Unpublishing the form will make it unavailable to the public. You
              can still edit the form settings and questions.{' '}
            </Text>
            <Button
              onClick={async () => await handleUnpublish(formContext.form)}
              style={{ width: '100%', marginTop: '1rem' }}
              variant='light'
              color='red'
            >
              Unpublish Form
            </Button>
          </>
        ) : (
          <>
            <Text size='md'>
              Are you sure you want to publish the form? <br />
              <br />
              Publishing the form will make it available to the public on its
              release date. Note that you{' '}
              <Text span fw={700} fs='italic'>
                cannot edit the questions
              </Text>{' '}
              or any settings that affect the questions once the form is
              published but can still edit the form settings.
            </Text>
            <Button
              onClick={async () => {
                if (!validateQuestionsAndSettings(formContext.form)) return;
                await handleSaveAndPublish(formContext.form);
              }}
              style={{ width: '100%', marginTop: '1rem' }}
              variant='light'
              color='green'
            >
              Save and Publish Form
            </Button>
          </>
        )}
      </Modal>

      <div className='flex w-[30rem] flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <Divider label='General' />
          <Switch
            defaultChecked={formContext.form.is_mlh}
            label='Include MLH Questions'
            description='MLH Questions are required for any registration forms such as the application. This cannot be changed once the form is published.'
            disabled={formContext.form.is_published}
            onChange={handleIncludeMLH}
          />
          <Switch
            defaultChecked={formContext.form.required_for_checkin}
            label='Require Submission'
            description='Require submission of this form to complete registration.'
            onChange={handleRequireSubmission}
          />
        </div>

        <div className='flex flex-col gap-2'>
          <Divider label='Release Settings' />
          <div className='flex flex-col'>
            <DateTimePicker
              description='The date and time the form will be released. If no date is set, the form will be released immediately upon its publishing.'
              defaultValue={formContext.form.opens_at}
              valueFormat='MMM DD YYYY hh:mm A'
              placeholder='Select a date and time'
              label='Release Date'
              onChange={(date) => {
                formContext.setForm({ ...formContext.form, opens_at: date });
              }}
              styles={{
                input: {
                  borderColor: openDateError.error
                    ? 'red'
                    : 'var(--mantine-color-dark-4)',
                },
              }}
              clearable
            />
            {openDateError.error ? (
              <p className='text-sm text-red-500'>{openDateError.msg}</p>
            ) : null}
          </div>
          <div className='flex flex-col'>
            <DateTimePicker
              description='The date and time the form will be closed.'
              defaultValue={formContext.form.closes_at}
              valueFormat='MMM DD YYYY hh:mm A'
              placeholder='Select a date and time'
              label='Close Date'
              onChange={(date) => {
                formContext.setForm({ ...formContext.form, closes_at: date });
              }}
              styles={{
                input: {
                  borderColor: closeDateError.error
                    ? 'red'
                    : 'var(--mantine-color-dark-4)',
                },
              }}
              required
            />
            {closeDateError.error ? (
              <p className='text-sm text-red-500'>{closeDateError.msg}</p>
            ) : null}
          </div>
        </div>

        <div>
          <Button
            onClick={async () => await handleSaveFormSettings(formContext.form)}
            style={{ width: '100%', marginTop: '1rem', marginBottom: '0.5rem' }}
            variant='light'
            color='blue'
          >
            Save Settings
          </Button>
          {formContext.form.is_published ? (
            <>
              <Button
                onClick={open}
                style={{ width: '100%', marginBottom: '0.5rem' }}
                color='red'
                variant='light'
              >
                Unpublish Form
              </Button>
              <p className='text-xs text-[var(--mantine-color-dimmed)]'>
                Unpublishing the form will make it unavailable to the public.
                You can still edit the form settings and questions.
              </p>
              <div className='mt-2 flex flex-row-reverse items-center gap-2'>
                <button
                  onClick={() => {
                    const domain =
                      window.location.href.match(/^(https?:\/\/[^\/]+)/);
                    if (domain === null) {
                      notifications.show({
                        title: 'Error',
                        message: 'There was an error copying to the clipboard.',
                      });
                      return;
                    }
                    navigator.clipboard.writeText(
                      `${domain[0]}/hacker/forms/${formContext.form.id}`
                    );
                    notifications.show({
                      title: 'Copied!',
                      message: 'Form link copied to clipboard',
                    });
                  }}
                >
                  <IconLink size={20} stroke={1.5} className='text-blue-500' />
                </button>
                <p>Share Form</p>
              </div>
            </>
          ) : (
            <>
              <Button
                onClick={() => {
                  if (!validateQuestionsAndSettings(formContext.form)) return;
                  open();
                }}
                style={{ width: '100%', marginBottom: '0.5rem' }}
                color='green'
                variant='light'
              >
                Save and Publish Form
              </Button>
              <p className='text-xs text-[var(--mantine-color-dimmed)]'>
                Publishing the form will make it available to the public on its
                release date. Note that you cannot edit the questions or any
                settings that affect the questions once the form is published
                but can still edit the form settings.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
