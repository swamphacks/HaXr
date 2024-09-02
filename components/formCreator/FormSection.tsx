'use client';

import { useContext } from 'react';
import { Button, Stack, Accordion, TextInput } from '@mantine/core';
import QuestionEdit from '@/components/formCreator/Question';
import { v4 as uuidv4 } from 'uuid';
import { QuestionType, Question as FormQuestion } from '@/types/question';
import { IconX, IconGripVertical } from '@tabler/icons-react';
import {
  FormSection,
  FormValidationError,
  FormErrorTypes,
} from '@/types/forms';
import { FormCreatorContext } from '@/components/formCreator/FormCreator';
import ErrorMessage from '@/components/formCreator/ErrorMessage';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function Section({ section }: { section: FormSection }) {
  const formContext = useContext(FormCreatorContext);
  const sections = formContext.form.sections as unknown as FormSection[];
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
  const removeQuestion = (key: string) => {
    formContext.setSections((oldSections: FormSection[]) =>
      oldSections.map((oldSection: FormSection) => {
        if (oldSection.key === section.key) {
          return {
            ...oldSection,
            questions: oldSection.questions.filter(
              (oldQuestion: FormQuestion) => oldQuestion.key !== key
            ),
          };
        }
        return oldSection;
      })
    );
  };

  const setQuestion = (newQuestion: FormQuestion, key: string) => {
    formContext.setSections((oldSections: FormSection[]) =>
      oldSections.map((oldSection: FormSection) => {
        if (oldSection.key === section.key) {
          return {
            ...oldSection,
            questions: oldSection.questions.map((oldQuestion: FormQuestion) => {
              if (oldQuestion.key === key) {
                return newQuestion;
              }
              return oldQuestion;
            }),
          };
        }
        return oldSection;
      })
    );
  };

  const handleSectionDeletion = (key: string) => {
    formContext.setSections(
      (formContext.form.sections as unknown as FormSection[]).filter(
        (oldSection: FormSection) => oldSection.key !== key
      )
    );
  };

  return (
    <div
      id={section.key}
      key={section.key}
      className='group relative flex flex-row items-center gap-2'
      style={style}
    >
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className='absolute left-[-30px] top-[20px] cursor-move text-transparent transition-all duration-300 group-hover:text-blue-500'
      >
        <IconGripVertical width={22} height={22} />
      </div>

      {formContext.form.is_published ||
      sections
        .flatMap((section) => section.questions)
        .some((question) => question.mlh) ? null : (
        <button onClick={() => handleSectionDeletion(section.key)}>
          <IconX stroke={1} className='absolute right-[-40px] top-[18px]' />
        </button>
      )}

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
              {errorWithSection && <ErrorMessage error={errorWithSection} />}
            </div>
            <TextInput
              onChange={handleSectionDescriptionChange}
              className='w-[48rem]'
              label='Section	Description'
              defaultValue={section.description}
              placeholder='Enter Description'
              disabled={formContext.form.is_published}
            />
            {noQuestionError && <ErrorMessage error={noQuestionError} />}

            {section.questions.map((question: FormQuestion) => (
              <QuestionEdit
                key={question.key}
                question={question}
                removeQuestion={() => removeQuestion(question.key)}
                setQuestion={(newQuestion: FormQuestion) =>
                  setQuestion(newQuestion, question.key)
                }
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
    </div>
  );
}
