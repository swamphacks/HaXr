'use client';

import { useState, useContext } from 'react';
import { Button, Text, Switch, Divider, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DateTimePicker } from '@mantine/dates';
import { FormSettings } from '@/types/forms';
import { questionType } from '@/types/questionTypes';
import { updateFormSettings, saveAndPublishForm } from '@/app/actions/Forms';
import {
  StatusIndicator,
  QuestionValidationError,
  FormSection,
  Question,
  fileTypes,
  fileSizes,
  FormErrorTypes,
} from '@/types/forms';
import { FormCreatorContext } from '@/components/formCreator/FormCreator';
import { notifications } from '@mantine/notifications';
import { isEmpty } from '@/utils/forms';

export default function Settings() {
  const {
    form,
    setForm,
    _,
    setErrors,
    setStatus,
    sections,
    autosaveTimer,
    save,
  } = useContext(FormCreatorContext);
  const [opened, { open, close }] = useDisclosure(false);
  const [settings, setSettings] = useState<FormSettings>({
    is_mlh: form.is_mlh,
    is_published: form.is_published,
    required: form.required,
    opens_at: form.opens_at,
    closes_at: form.closes_at,
  });

  const validate = () => {
    const errors: QuestionValidationError[] = [];

    // Validate Form Title
    if (isEmpty(form.title)) {
      errors.push({
        key: '',
        type: FormErrorTypes.FormTitle,
        message: 'Form title cannot be empty',
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
    });

    // Validate Questions
    sections
      .flatMap((section: FormSection) => section.questions)
      .forEach((question: Question) => {
        // Verify title is not empty
        if (isEmpty(question.title)) {
          errors.push({
            key: question.key,
            type: FormErrorTypes.Question,
            message: 'Question title cannot be empty',
          });
          return;
        }

        if (question.type === questionType.file) {
          const acceptedFiles = question.settings.acceptedFiles ?? [];
          const fileSize = question.settings.maxFileSize ?? '';

          // Validate file size
          if (!fileSizes.includes(fileSize)) {
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
            if (!fileTypes.includes(fileType)) {
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
            questionType.multiplechoice,
            questionType.dropdown,
            questionType.checkbox,
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

    setErrors(errors);
    console.log(errors);
    return errors.length;
  };

  const handleIncludeMLH = (e: any) => {
    setSettings({ ...settings, is_mlh: e.target.checked });
    // setForm({ ...form, is_mlh: e.target.checked });
  };

  const handleRequireSubmission = (e: any) => {
    setSettings({ ...settings, required: e.target.checked });
    // setForm({ ...form, required: e.target.checked });
  };

  const handleSaveFormSettings = async () => {
    if (autosaveTimer.current) {
      clearInterval(autosaveTimer.current);
    }

    setStatus(StatusIndicator.SAVING);
    const resp = await updateFormSettings({ ...form, ...settings });
    console.log(resp);
    setForm({ ...form, ...settings });
    setStatus(StatusIndicator.SUCCESS);

    autosaveTimer.current = setInterval(save, 1000);
  };

  const handleSaveAndPublish = async () => {
    if (autosaveTimer.current) {
      clearInterval(autosaveTimer.current);
    }
    const numErrors = validate();
    if (numErrors !== 0) {
      notifications.show({
        color: 'red',
        title: 'Error validating form',
        message:
          numErrors === 1
            ? 'There is 1 error in the form. Please fix it before publishing.'
            : `There are ${numErrors} errors in the form. Please fix them before publishing.`,
      });
      close();
      return;
    }
    setStatus(StatusIndicator.SAVING);

    const resp = await saveAndPublishForm(form, sections, settings);
    setSettings({ ...settings, is_published: true });
    setForm({ ...form, ...settings, is_published: true });
    console.log(resp);
    setStatus(StatusIndicator.SUCCESS);
    notifications.show({
      color: 'green',
      title: 'Success!',
      message: 'Form has been published successfully.',
    });

    autosaveTimer.current = setInterval(save, 1000);
    close();
  };

  const handleUnpublish = async () => {
    if (autosaveTimer.current) {
      clearInterval(autosaveTimer.current);
    }

    setStatus(StatusIndicator.SAVING);
    const resp = await updateFormSettings({ ...form, is_published: false });
    console.log(resp);
    // DO NOT CHANGE THE ORDER OF UPDATE OTHERWISE IT BREAKS
    setSettings({ ...settings, is_published: false });
    setForm({ ...form, is_published: false });
    setStatus(StatusIndicator.SUCCESS);
    notifications.show({
      title: 'Unpublished',
      message: 'Form has been unpublished successfully.',
    });

    autosaveTimer.current = setInterval(save, 1000);
    close();
  };

  return (
    <div className='flex flex-col items-center'>
      <Modal opened={opened} onClose={close} centered>
        {form.is_published ? (
          <>
            <Text size='md'>
              Are you sure you want to unpublish the form? <br />
              <br />
              Unpublishing the form will make it unavailable to the public. You
              can still edit the form settings and questions.{' '}
            </Text>
            <Button
              onClick={handleUnpublish}
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
              onClick={handleSaveAndPublish}
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
            defaultChecked={settings.is_mlh}
            label='Include MLH Questions'
            description='MLH Questions are required for any registration forms such as the application. This cannot be changed once the form is published.'
            disabled={settings.is_published}
            onChange={handleIncludeMLH}
          />
          <Switch
            defaultChecked={settings.required}
            label='Require Submission'
            description='Require submission of this form to complete registration.'
            onChange={handleRequireSubmission}
          />
        </div>

        <div className='flex flex-col gap-2'>
          <Divider label='Release Settings' />
          <DateTimePicker
            description='The date and time the form will be released. If no date is set, the form will be released immediately upon its publishing.'
            defaultValue={settings.opens_at}
            valueFormat='MMM DD YYYY hh:mm A'
            placeholder='Select a date and time'
            label='Release Date'
            onChange={(date) => {
              setSettings({ ...settings, opens_at: date });
              // setForm({ ...form, opens_at: date?.toISOString() });
            }}
            clearable
          />
          <DateTimePicker
            description='The date and time the form will be closed.'
            defaultValue={settings.closes_at}
            valueFormat='MMM DD YYYY hh:mm A'
            placeholder='Select a date and time'
            label='Close Date'
            onChange={(date) => {
              setSettings({ ...settings, closes_at: date });
              // setForm({ ...form, closes_at: date?.toISOString() });
            }}
            required
          />
        </div>

        <div>
          <Button
            onClick={handleSaveFormSettings}
            style={{ width: '100%', marginTop: '1rem', marginBottom: '0.5rem' }}
            variant='light'
            color='blue'
          >
            Save Settings
          </Button>
          {form.is_published ? (
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
            </>
          ) : (
            <>
              <Button
                onClick={open}
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