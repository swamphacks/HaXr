'use client';

import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Button, Tabs, rem, Accordion, TextInput } from '@mantine/core';
import {
  IconForms,
  IconMessageCircle,
  IconSettings,
  IconX,
} from '@tabler/icons-react';
import { v4 as uuidv4 } from 'uuid';
import {
  FormSection,
  FormValidationError,
  FormErrorTypes,
  FormContext,
} from '@/types/forms';
import { updateForm } from '@/app/actions/forms';
import { Form } from '@prisma/client';
import { StatusIndicator } from '@/types/forms';
import Status from '@/components/status';
import { objectEquals } from '@/utils/saveUtils';
import Section from '@/components/formCreator/FormSection';
import Settings from '@/components/formCreator/FormSettings';
import ErrorMessage from '@/components/formCreator/ErrorMessage';
import useFormStateWithRefs from '@/utils/stateWithRef';

export const FormCreatorContext = createContext<FormContext>({} as FormContext);

function ApplicationCreator() {
  const formContext: FormContext = useContext<FormContext>(FormCreatorContext);
  const handleAddSection = () => {
    formContext.setErrors(
      formContext.errors.filter(
        (error: FormValidationError) => error.type !== FormErrorTypes.NoSections
      )
    );
    formContext.setSections([
      ...(formContext.form.sections as unknown as FormSection[]),
      {
        key: uuidv4(),
        title: 'Untitled Section',
        description: '',
        questions: [],
      },
    ]);
  };

  const handleDeletion = (key: string) => {
    formContext.setSections(
      (formContext.form.sections as unknown as FormSection[]).filter(
        (oldSection: FormSection) => oldSection.key !== key
      )
    );
  };

  const titleError = formContext.errors.find(
    (error: FormValidationError) => error.type === FormErrorTypes.FormTitle
  );

  const noSectionsError = formContext.errors.find(
    (error: FormValidationError) => error.type === FormErrorTypes.NoSections
  );

  return (
    <div className='grid w-full grid-cols-1 justify-items-center'>
      <div className='mb-4 grid w-[700px] grid-cols-1 gap-2'>
        <div>
          <TextInput
            label='Form Title'
            placeholder='Untitled Form'
            value={formContext.form.title}
            onChange={(e) => {
              formContext.setErrors(
                formContext.errors.filter(
                  (error: FormValidationError) =>
                    error.type !== FormErrorTypes.FormTitle
                )
              );
              formContext.setForm((oldForm: Form) => {
                return { ...oldForm, title: e.target.value };
              });
            }}
            disabled={formContext.form.is_published}
            styles={{
              input: { borderColor: titleError ? 'red' : 'var(--input-bd)' },
            }}
          />
          {titleError && <ErrorMessage error={titleError} />}
        </div>
        <TextInput
          label='Description'
          placeholder='Description'
          value={formContext.form.description ?? ''}
          onChange={(e) => {
            formContext.setErrors(
              formContext.errors.filter(
                (error: FormValidationError) =>
                  error.type !== FormErrorTypes.FormTitle
              )
            );
            formContext.setForm((oldForm: Form) => {
              return { ...oldForm, description: e.target.value };
            });
          }}
          disabled={formContext.form.is_published}
        />
        {noSectionsError && <ErrorMessage error={noSectionsError} />}
      </div>

      <Accordion
        transitionDuration={500}
        styles={{
          label: {
            fontSize: '1.5rem',
          },
          panel: {
            marginTop: '1rem',
          },
          root: {
            width: '900px',
          },
        }}
      >
        {(formContext.form.sections as unknown as FormSection[]).map(
          (section: FormSection) => {
            return (
              <div key={section.key} className='relative flex flex-row'>
                <Section section={section} />
                {formContext.form.is_published ? null : (
                  <button onClick={() => handleDeletion(section.key)}>
                    <IconX
                      stroke={1}
                      className='absolute right-[-40px] top-[18px]'
                    />
                  </button>
                )}
              </div>
            );
          }
        )}
      </Accordion>

      <Button
        variant='light'
        color='teal'
        onClick={handleAddSection}
        disabled={formContext.form.is_published}
        styles={{ root: { marginTop: '2rem' } }}
      >
        Add Section
      </Button>
    </div>
  );
}

export function CreateApplication({ initialForm }: { initialForm: Form }) {
  const iconStyle = { width: rem(12), height: rem(12) };
  const [errors, setErrors] = useState<FormValidationError[]>([]);
  const [form, setForm, setSections, formRef] =
    useFormStateWithRefs(initialForm);
  const [status, setStatus] = useState<StatusIndicator>(
    StatusIndicator.LOADING
  );

  const autosaveTimer = useRef<NodeJS.Timeout>();
  const prevForm = useRef<Form>(initialForm);

  const save = async () => {
    // Extract the settings - we don't want settings to be autosaved
    const {
      is_mlh,
      opens_at,
      closes_at,
      required_for_checkin,
      is_published,
      ...currForm
    } = formRef.current;
    //
    // prevForm will always hold the initial form settings
    // make sure formRef goes after prevForm so the attributes are overriden correctly
    const combinedForm = { ...prevForm.current, ...formRef.current };
    if (!is_published && !objectEquals(combinedForm, prevForm.current)) {
      setStatus(StatusIndicator.SAVING);
      await updateForm(combinedForm).catch((e) => {
        setStatus(StatusIndicator.FAILED);
        console.error(e);
      });
      prevForm.current = combinedForm;
      setStatus(StatusIndicator.SUCCESS);
      console.log('saved');
    }
  };

  useEffect(() => {
    setStatus(StatusIndicator.SUCCESS);
    autosaveTimer.current = setInterval(save, 1000);
    return () => {
      if (autosaveTimer.current) {
        clearInterval(autosaveTimer.current);
      }
    };
  }, []);

  return (
    <FormCreatorContext.Provider
      value={{
        form: form,
        setForm: setForm,
        setSections: setSections,
        errors: errors,
        setErrors: setErrors,
        setStatus: setStatus,
        autosaveTimer: autosaveTimer,
        save: save,
      }}
    >
      <div className='flex flex-row-reverse'>
        <Status status={status} />
      </div>
      <Tabs defaultValue='gallery'>
        <Tabs.List justify='center' style={{ marginBottom: '2rem' }}>
          <Tabs.Tab
            value='gallery'
            leftSection={<IconForms style={iconStyle} />}
          >
            Questions
          </Tabs.Tab>
          <Tabs.Tab
            value='messages'
            leftSection={<IconMessageCircle style={iconStyle} />}
          >
            Responses
          </Tabs.Tab>{' '}
          <Tabs.Tab
            value='settings'
            leftSection={<IconSettings style={iconStyle} />}
          >
            Settings
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value='gallery'>
          <ApplicationCreator />
        </Tabs.Panel>

        <Tabs.Panel value='messages'>
          <h1> Responses tab content </h1>
        </Tabs.Panel>

        <Tabs.Panel value='settings'>
          <Settings />
        </Tabs.Panel>
      </Tabs>
    </FormCreatorContext.Provider>
  );
}
