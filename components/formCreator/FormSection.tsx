'use client';

import { useContext } from 'react';
import { Button, Stack, Accordion, TextInput } from '@mantine/core';
import QuestionEdit from '@/components/formCreator/Question';
import { v4 as uuidv4 } from 'uuid';
import { QuestionType, Question as FormQuestion } from '@/types/question';
import {
  FormSection,
  FormValidationError,
  FormErrorTypes,
} from '@/types/forms';
import { FormCreatorContext } from '@/components/formCreator/FormCreator';
import ErrorMessage from '@/components/formCreator/ErrorMessage';

export default function Section({ section }: { section: FormSection }) {
  const formContext = useContext(FormCreatorContext);

  const handleAddQuestion = () => {
    formContext.setErrors(
      formContext.errors.filter(
        (error: FormValidationError) =>
          error.key !== section.key && error.type !== FormErrorTypes.NoQuestions
      )
    );
    formContext.setSections((oldSections: FormSection[]) => {
      return oldSections.map((oldSection: FormSection) => {
        if (oldSection.key === section.key) {
          return {
            ...oldSection,
            questions: [
              ...oldSection.questions,
              {
                title: '',
                description: '',
                type: QuestionType.shortResponse,
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

  const errorWithSection = formContext.errors.find(
    (error: FormValidationError) => {
      return (
        error.type === FormErrorTypes.SectionTitle && error.key === section.key
      );
    }
  );

  const noQuestionError = formContext.errors.find(
    (error: FormValidationError) => {
      return (
        error.type === FormErrorTypes.NoQuestions && error.key === section.key
      );
    }
  );

  const errorInSection = formContext.errors.some(
    (error: FormValidationError) => {
      return section.questions.some((question: FormQuestion) => {
        return error.key === question.key;
      });
    }
  );

  const handleSectionTitleChange = (e: any) => {
    if (errorWithSection) {
      formContext.setErrors(
        formContext.errors.filter(
          (error: FormValidationError) => error.key !== errorWithSection.key
        )
      );
    }
    formContext.setSections((oldSections: FormSection[]) => {
      return oldSections.map((oldSection: FormSection) => {
        if (oldSection.key === section.key) {
          return { ...oldSection, title: e.target.value };
        }
        return oldSection;
      });
    });
  };

  const handleSectionDescriptionChange = (e: any) => {
    formContext.setSections((oldSections: FormSection[]) => {
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
              errorWithSection || errorInSection || noQuestionError
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
              disabled={formContext.form.is_published}
              styles={{
                input: {
                  borderColor: errorWithSection ? 'red' : 'var(--input-bd)',
                },
              }}
            />
            <ErrorMessage error={errorWithSection} />
          </div>
          <TextInput
            onChange={handleSectionDescriptionChange}
            className='w-[48rem]'
            label='Section	Description'
            defaultValue={section.description}
            placeholder='Enter Description'
            disabled={formContext.form.is_published}
          />
          <ErrorMessage error={noQuestionError} />

          {section.questions.map((question: FormQuestion) => (
            <QuestionEdit
              key={question.key}
              question={question}
              removeQuestion={() => {
                formContext.setSections((oldSections: FormSection[]) => {
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
                formContext.setSections((oldSections: FormSection[]) => {
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
            disabled={formContext.form.is_published}
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
