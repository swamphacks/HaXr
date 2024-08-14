'use client';

import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Box, Button, Stack, Tabs, rem, Accordion } from '@mantine/core';
import {
  IconForms,
  IconMessageCircle,
  IconSettings,
  IconX,
} from '@tabler/icons-react';
import classes from '@/styles/Input.module.css';
import { v4 as uuidv4 } from 'uuid';
import {
  FormSection,
  QuestionValidationError,
  FormErrorTypes,
} from '@/types/forms';
import { getForm, updateForm, updateFormSettings } from '@/app/actions/Forms';
import { Form } from '@prisma/client';
import { StatusIndicator } from '@/types/forms';
import Status from '@/components/status';
import { sectionEquals, recordEquals } from '@/utils/saveUtils';
import useStateWithRef from '@/utils/stateWithRef';
import Section from '@/components/formCreator/FormSection';
import Settings from '@/components/formCreator/FormSettings';

export const FormCreatorContext = createContext(null as any);

function ApplicationCreator({
  form,
  setForm,
  sections,
  setSections,
}: {
  form: Form;
  setForm: any;
  sections: FormSection[];
  setSections: any;
}) {
  const { a, b, errors, setErrors, ...args } = useContext(FormCreatorContext);
  const handleAddSection = () => {
    setSections((oldSections: FormSection[]) => {
      return [
        ...oldSections,
        {
          key: uuidv4(),
          title: 'Unititled Section',
          description: '',
          questions: [],
        },
      ];
    });
  };

  const handleDeletion = (key: string) => {
    setSections((oldSections: FormSection[]) => {
      return oldSections.filter(
        (oldSection: FormSection) => oldSection.key !== key
      );
    });
  };

  const titleError = errors.find(
    (error: QuestionValidationError) => error.type === FormErrorTypes.FormTitle
  );

  return (
    <div className='grid w-full grid-cols-1 justify-items-center'>
      <div className='grid w-[700px] grid-cols-1'>
        <input
          placeholder='Untitled Form'
          defaultValue={form.title}
          onChange={(e) => {
            setErrors(
              errors.filter(
                (error: QuestionValidationError) =>
                  error.type !== FormErrorTypes.FormTitle
              )
            );
            setForm((oldForm: Form) => {
              return { ...oldForm, title: e.target.value };
            });
          }}
          disabled={form.is_published}
          className={classes.title}
          style={{
            borderColor: titleError ? 'red' : 'var(--mantine-color-dark-3)',
          }}
        />
        {titleError ? (
          <p className='justify-self-start text-sm text-red-500'>
            {titleError.message}
          </p>
        ) : null}
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
        {sections.map((section: FormSection) => {
          return (
            <div
              key={section.key}
              className='relative flex flex-row'
              style={{ width: form.is_published ? '100%' : '95%' }}
            >
              <Section setSections={setSections} section={section} />
              {form.is_published ? null : (
                <button onClick={() => handleDeletion(section.key)}>
                  <IconX
                    stroke={1}
                    className='absolute right-[-40px] top-[18px]'
                  />
                </button>
              )}
            </div>
          );
        })}
      </Accordion>

      <Stack gap='md' align='center' justify='flex-start' className='mt-4'>
        <Button
          variant='light'
          color='teal'
          style={{ width: '48rem' }}
          onClick={handleAddSection}
          disabled={form.is_published}
        >
          Add Section
        </Button>
      </Stack>
    </div>
  );
}

export function CreateApplication({ params }: { params: { id: string } }) {
  const iconStyle = { width: rem(12), height: rem(12) };
  const [form, setForm, formRef] = useStateWithRef<Form>();
  const [sections, setSections, sectionsRef] = useStateWithRef<FormSection[]>(
    []
  );
  const [errors, setErrors] = useState<QuestionValidationError[]>([]);
  const [status, setStatus] = useState<StatusIndicator>(
    StatusIndicator.LOADING
  );

  const autosaveTimer = useRef<NodeJS.Timeout>();
  const prevForm = useRef<Form>();
  const prevSections = useRef<FormSection[]>([]);

  const sectionsEqual = (section: FormSection[]) => {
    if (section.length !== prevSections.current.length) return false;
    return section.every((section: FormSection, index: number) => {
      return sectionEquals(section, prevSections.current[index]);
    });
  };

  const save = async () => {
    try {
      if (formRef.current && sectionsRef.current) {
        // Update the form if there are changes
        if (!formRef.current.is_published) {
          if (
            !recordEquals(
              { ...formRef.current, sections: undefined },
              { ...prevForm.current, sections: undefined }
            ) ||
            !sectionsEqual(sectionsRef.current)
          ) {
            // update refs
            prevForm.current = formRef.current;
            prevSections.current = sectionsRef.current;
            await updateForm(formRef.current, sectionsRef.current);
            setStatus(StatusIndicator.SUCCESS);
            console.log('saved');
          }
        } else {
          if (
            !recordEquals(
              { ...formRef.current, sections: undefined },
              { ...prevForm.current, sections: undefined }
            )
          ) {
            prevForm.current = formRef.current;
            await updateFormSettings(formRef.current);
            setStatus(StatusIndicator.SUCCESS);
            console.log('saved settings');
          }
        }
      }
    } catch (e) {
      setStatus(StatusIndicator.FAILED);
      console.log(e);
    }
  };

  useEffect(() => {
    getForm(params.id)
      .then((res) => {
        if (res) {
          setForm(res);
          setSections(res.sections as unknown as FormSection[]);
          setStatus(StatusIndicator.SUCCESS);
          console.log(res);

          autosaveTimer.current = setInterval(save, 1000);
        } else {
          setStatus(StatusIndicator.FAILED);
        }
      })
      .catch((e) => {
        console.error(e);
      });

    return () => {
      if (autosaveTimer.current) {
        clearInterval(autosaveTimer.current);
      }
    };
  }, [params.id]);

  return (
    <FormCreatorContext.Provider
      value={{
        form,
        setForm,
        errors,
        setErrors,
        setStatus,
        sections,
        autosaveTimer,
        save,
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
          {form && sections ? (
            <ApplicationCreator
              form={form}
              setForm={setForm}
              sections={sections}
              setSections={setSections}
            />
          ) : null}
        </Tabs.Panel>

        <Tabs.Panel value='messages'>
          {form ? <h1> Responses tab content </h1> : null}
        </Tabs.Panel>

        <Tabs.Panel value='settings'>
          {form && sections ? <Settings /> : null}
        </Tabs.Panel>
      </Tabs>
    </FormCreatorContext.Provider>
  );
}
