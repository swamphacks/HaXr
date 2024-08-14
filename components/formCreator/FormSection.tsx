'use client';

import { useContext } from 'react';
import { Button, Stack, Accordion, TextInput } from '@mantine/core';
import QuestionEdit from '@/components/formCreator/Question';
import { v4 as uuidv4 } from 'uuid';
import { questionType } from '@/types/questionTypes';
import {
  Question as FormQuestion,
  FormSection,
  QuestionValidationError,
  FormErrorTypes,
} from '@/types/forms';
import { FormCreatorContext } from '@/components/formCreator/FormCreator';

export default function Section({
  setSections,
  section,
}: {
  setSections: React.Dispatch<React.SetStateAction<FormSection[]>>;
  section: FormSection;
}) {
  const { form, _, errors, setErrors, ...args } =
    useContext(FormCreatorContext);

  const handleAddQuestion = () => {
    setSections((oldSections: FormSection[]) => {
      return oldSections.map((oldSection: FormSection) => {
        if (oldSection.key === section.key) {
          return {
            ...oldSection,
            questions: [
              ...oldSection.questions,
              {
                title: '',
                description: '',
                type: questionType.shortResponse,
                settings: {
                  required: false,
                },
                key: uuidv4(),
              },
            ],
          };
        }
        return oldSection;
      });
    });
  };

  const errorWithSection = errors.find((error: QuestionValidationError) => {
    return (
      error.type === FormErrorTypes.SectionTitle && error.key === section.key
    );
  });

  const errorInSection = errors.some((error: QuestionValidationError) => {
    return section.questions.some((question: FormQuestion) => {
      return error.key === question.key;
    });
  });

  const handleSectionTitleChange = (e: any) => {
    if (errorWithSection) {
      setErrors(
        errors.filter(
          (error: QuestionValidationError) => error.key !== errorWithSection.key
        )
      );
    }
    setSections((oldSections: FormSection[]) => {
      return oldSections.map((oldSection: FormSection) => {
        if (oldSection.key === section.key) {
          return { ...oldSection, title: e.target.value };
        }
        return oldSection;
      });
    });
  };

  const handleSectionDescriptionChange = (e: any) => {
    setSections((oldSections: FormSection[]) => {
      return oldSections.map((oldSection: FormSection) => {
        if (oldSection.key === section.key) {
          return { ...oldSection, description: e.target.value };
        }
        return oldSection;
      });
    });
  };

  return (
    <Accordion.Item
      key={section.key}
      value={section.key}
      style={{ flexGrow: 2 }}
    >
      <Accordion.Control
        styles={{
          label: {
            color:
              errorWithSection || errorInSection
                ? 'var(--mantine-color-red-6)'
                : 'inherit',
            height: '61px',
          },
        }}
      >
        {section.title || 'Untitled Section'}
      </Accordion.Control>
      <Accordion.Panel>
        <Stack align='center'>
          <div>
            <TextInput
              onChange={handleSectionTitleChange}
              className='w-[48rem]'
              label='Section	Title'
              defaultValue={section.title}
              placeholder='Untitled Section'
              disabled={form.is_published}
              styles={{
                input: {
                  borderColor: errorWithSection ? 'red' : 'var(--input-bd)',
                },
              }}
            />
            {errorWithSection ? (
              <p className='text-sm text-red-500'>{errorWithSection.message}</p>
            ) : null}
          </div>
          <TextInput
            onChange={handleSectionDescriptionChange}
            className='w-[48rem]'
            label='Section	Description'
            defaultValue={section.description}
            placeholder='Enter Description'
            disabled={form.is_published}
          />
          {section.questions.map((question: FormQuestion) => (
            <QuestionEdit
              key={question.key}
              question={question}
              removeQuestion={() => {
                setSections((oldSections: FormSection[]) => {
                  return oldSections.map((oldSection: FormSection) => {
                    if (oldSection.key === section.key) {
                      return {
                        ...oldSection,
                        questions: oldSection.questions.filter(
                          (oldQuestion: FormQuestion) =>
                            oldQuestion.key !== question.key
                        ),
                      };
                    }
                    return oldSection;
                  });
                });
              }}
              setQuestion={(newQuestion: FormQuestion) => {
                setSections((oldSections: FormSection[]) => {
                  return oldSections.map((oldSection: FormSection) => {
                    if (oldSection.key === section.key) {
                      return {
                        ...oldSection,
                        questions: oldSection.questions.map(
                          (oldQuestion: FormQuestion) => {
                            if (oldQuestion.key === question.key) {
                              return newQuestion;
                            }
                            return oldQuestion;
                          }
                        ),
                      };
                    }
                    return oldSection;
                  });
                });
              }}
            />
          ))}
          <Button
            disabled={form.is_published}
            style={{ width: '48rem' }}
            variant='light'
            color='orange'
            onClick={handleAddQuestion}
          >
            Add Question
          </Button>
        </Stack>
      </Accordion.Panel>
    </Accordion.Item>
  );
}