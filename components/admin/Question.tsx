import { useState, useRef } from 'react';
import { createContext } from 'react';
import {
  Button,
  Stack,
  Select,
  Switch,
  Divider,
  Tooltip,
  Checkbox,
  NumberInput,
  Textarea,
  TextInput,
  Group,
} from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import {
  DndContext,
  closestCorners,
  useSensors,
  useSensor,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import {
  IconGripHorizontal,
  IconTrash,
  IconRubberStamp,
  IconInfoCircle,
  IconFolder,
} from '@tabler/icons-react';
import { v4 as uuidv4 } from 'uuid';
import Choices from '@/components/admin/Choices';
import classes from '@/styles/Input.module.css';
import Droppable from '@/components/dnd/Droppable';
import { rem } from '@mantine/core';

import { CSS } from '@dnd-kit/utilities';
import { useSortable, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import {
  FormQuestion,
  questionType,
  answerChoice,
  SelectionQuestion,
  Agreement,
  fileTypes,
  FileType,
  FileQuestion,
  hasAnswerChoices,
  fileSizes,
} from '@/types/questionTypes';

function FileCheckBox({
  label,
  acceptedTypes,
  setAllowedFileTypes,
  iconSize = 18,
  defaultChecked = false,
}: {
  label: string;
  acceptedTypes: string;
  setAllowedFileTypes: any;
  iconSize?: number;
  defaultChecked?: boolean;
}) {
  return (
    <div className='flex flex-row items-center gap-2'>
      <Checkbox
        label={label}
        defaultChecked={defaultChecked}
        onChange={(e) => {
          if (e.currentTarget.checked) {
            setAllowedFileTypes((types: string[]) => {
              return [...types, label];
            });
          } else {
            setAllowedFileTypes((types: string[]) => {
              const index = types.indexOf(label);
              return [...types.slice(0, index), ...types.slice(index + 1)];
            });
          }
        }}
      />
      <Tooltip label={acceptedTypes}>
        <IconInfoCircle width={iconSize} />
      </Tooltip>
    </div>
  );
}

function AnswerChoiceHeader() {
  return <h2 className='text-lg font-semibold'>Answer Choices</h2>;
}

function getQuestionType(value: string) {
  switch (value) {
    case 'Multiple Choice':
      return questionType.multiplechoice;
    case 'Checkbox':
      return questionType.checkbox;
    case 'Dropdown':
      return questionType.dropdown;
    case 'Short Answer':
      return questionType.shortResponse;
    case 'Paragraph':
      return questionType.paragraph;
    case 'Address':
      return questionType.address;
    case 'File Upload':
      return questionType.file;
    default:
      console.error(
        `Invalid question type '{value}'. Defaulting to 'Paragraph'`
      );
      return questionType.paragraph;
  }
}

function AddChoice({ otherIncluded, setChoices, setOther }: any) {
  return (
    <div className='flex flex-row gap-2'>
      <button
        onClick={() => {
          return otherIncluded
            ? setChoices((choices: answerChoice[]) => [
                ...choices.slice(0, -1),
                { value: '', id: uuidv4() },
                choices[choices.length - 1],
              ])
            : setChoices((choices: answerChoice[]) => [
                ...choices,
                { value: '', id: uuidv4() },
              ]);
        }}
      >
        Add Choice
      </button>
      {!otherIncluded ? (
        <>
          <p> or </p>
          <button
            onClick={() => {
              setChoices((choices: answerChoice[]) => [
                ...choices,
                { value: '', id: uuidv4(), other: true },
              ]);
              setOther(true);
            }}
            className='text-blue-500'
          >
            add &quot;Other&quot;
          </button>
        </>
      ) : null}
    </div>
  );
}

export const OtherIncludedContext = createContext({
  setOther: (value: boolean) => {},
  setChoices: (value: any) => {},
});

export default function Question({
  question,
  setQuestions,
  disabled = false,
}: {
  question: FormQuestion;
  setQuestions: any;
  disabled: boolean;
}) {
  const [selectedQuestionType, setQuestionType] = useState<string>(
    question.type
  );
  const [choices, setChoices] = useState<answerChoice[]>(
    hasAnswerChoices(question)
      ? (question as SelectionQuestion).answerChoices
      : []
  );
  const [required, setRequired] = useState<boolean>(question.required);
  const [title, setTitle] = useState<string>(question.title);
  const [mustAgree, setMustAgree] = useState<boolean>(false);
  const [otherIncluded, setOther] = useState<boolean>(
    (hasAnswerChoices(question) &&
      (question as SelectionQuestion).answerChoices?.some((c) => c.other)) ||
      false
  );
  const [allowCertainFiles, setAllowCertainFiles] = useState<boolean>(
    question.type === questionType.file
      ? !(question as FileQuestion).allowAllTypes
      : false
  );
  const [allowedFileTypes, setAllowedFileTypes] = useState<string[]>(
    question.type === questionType.file
      ? (question as FileQuestion).allowedFileTypes || []
      : []
  );

  const getChoicePos = (id: string) =>
    choices.findIndex((choice: answerChoice) => choice.id === id);
  const handleDragged = (event: any) => {
    const { active, over } = event;
    if (active.id === over.id) return;

    setChoices((choices: answerChoice[]) => {
      const originalPos = getChoicePos(active.id);
      const newPos = getChoicePos(over.id);

      return arrayMove(choices, originalPos, newPos);
    });
  };

  const id = question.id;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const openRef = useRef<() => void>(null);
  const maxFileSize = useRef<string>(
    question.type === questionType.file
      ? (question as FileQuestion).maximumFileSize
      : fileSizes[0]
  );
  const maxFiles = useRef<number>(
    question.type === questionType.file
      ? (question as FileQuestion).maximumFiles
      : 1
  );

  return (
    <div
      className='cursor-default touch-none rounded-md border-2 border-[var(--mantine-color-dark-2)] bg-[var(--mantine-color-body)] p-4 pt-1'
      style={{ width: rem(500), ...style }}
      key={question.id}
      ref={setNodeRef}
      {...attributes}
    >
      {!disabled ? (
        <div className='grid grid-cols-3'>
          <div />
          <IconGripHorizontal
            className='w-5 cursor-pointer justify-self-center'
            {...listeners}
          />
        </div>
      ) : null}

      <Stack>
        {/* Question Title */}
        <textarea
          placeholder='Enter question title'
          className={
            classes.input + ' box-border h-8 resize-y overflow-y-hidden text-lg'
          }
          defaultValue={question.title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={disabled}
          required
        />

        {/* Question Type */}
        <Select
          data={Object.values(questionType)}
          value={selectedQuestionType}
          onChange={(e) => {
            if (e) {
              question.type = getQuestionType(e);
              setQuestionType(e);
            }
          }}
          disabled={disabled}
          required
        />

        {/* Answer Choices */}
        {hasAnswerChoices(question) ? (
          <OtherIncludedContext.Provider value={{ setOther, setChoices }}>
            <AnswerChoiceHeader />
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragEnd={handleDragged}
            >
              <Droppable id='droppable'>
                <Choices
                  choices={choices}
                  disabled={disabled}
                  questionType={question.type}
                />
              </Droppable>
            </DndContext>
            {!disabled ? (
              <AddChoice
                setChoices={setChoices}
                otherIncluded={otherIncluded}
                setOther={setOther}
              />
            ) : null}
          </OtherIncludedContext.Provider>
        ) : null}

        {/* Address Type Question */}
        {selectedQuestionType === questionType.shortResponse ? (
          <TextInput placeholder='Enter response' disabled />
        ) : null}

        {/* Paragraph Type Question */}
        {selectedQuestionType === questionType.paragraph ? (
          <Textarea placeholder='Enter response' disabled />
        ) : null}

        {/* Agreement Type Question */}
        {selectedQuestionType === questionType.agreement ? (
          <Checkbox label={title} disabled />
        ) : null}

        {/* Address Type Question */}
        {selectedQuestionType === questionType.address ? (
          <Stack>
            <TextInput disabled label='Address Line 1' />
            <TextInput disabled label='Address Line 2' />
            <TextInput disabled label='City' />
            <TextInput disabled label='State' />
            <TextInput disabled label='Country' />
            <TextInput disabled label='Pincode' />
          </Stack>
        ) : null}

        {/* File Type Question */}
        {selectedQuestionType === questionType.file ? (
          <>
            <Switch
              label='Allow only certain files'
              labelPosition='left'
              defaultChecked={allowCertainFiles}
              onChange={(e) => setAllowCertainFiles(e.currentTarget.checked)}
            />
            {allowCertainFiles ? (
              <div className='grid grid-cols-2 gap-2'>
                {fileTypes.map((fileType: FileType, index: number) => (
                  <FileCheckBox
                    key={index}
                    label={fileType.type}
                    setAllowedFileTypes={setAllowedFileTypes}
                    acceptedTypes={fileType.extensions.join(', ')}
                    defaultChecked={allowedFileTypes?.includes(fileType.type)}
                  />
                ))}
              </div>
            ) : null}
            <NumberInput
              label='Maximum number of files'
              defaultValue={maxFiles.current}
              min={1}
              max={10}
              onChange={(e) =>
                typeof e === 'number' ? (maxFiles.current = e) : null
              }
            />
            <Select
              label='Maximum File Size'
              defaultValue={maxFileSize.current}
              data={fileSizes}
              onChange={(e) => (maxFileSize.current = e || maxFileSize.current)}
            />
            <div className='flex flex-row-reverse'>
              <button className='flex flex-row gap-2 text-blue-500'>
                <IconFolder stroke={1.25} width={24} />
                View Folder
              </button>
            </div>
            <Dropzone openRef={openRef} onDrop={() => {}} />

            <Group justify='center' mt='md'>
              <Button onClick={() => openRef.current?.()}>Select files</Button>
            </Group>
          </>
        ) : null}

        {/* Question Settings */}
        <Divider />
        <div className='flex flex-row-reverse items-center gap-4'>
          <Switch
            label='Required'
            defaultChecked={question.required}
            onChange={() =>
              setRequired((value) => {
                return !value;
              })
            }
            size='xs'
            labelPosition='left'
          />
          <Divider orientation='vertical' />
          <Tooltip label='Delete' color='gray'>
            <button
              className='justify-self-end'
              onClick={() =>
                setQuestions((oldQuestions: FormQuestion[]) =>
                  oldQuestions.filter((q) => q.id !== question.id)
                )
              }
            >
              <IconTrash className='w-5' stroke={1.25} />
            </button>
          </Tooltip>
          <Tooltip label='Duplicate' color='gray'>
            <button
              className='justify-self-end'
              onClick={() => {
                switch (selectedQuestionType) {
                  case questionType.multiplechoice:
                  case questionType.checkbox:
                  case questionType.dropdown:
                    setQuestions((oldQuestions: FormQuestion[]) => [
                      ...oldQuestions,
                      {
                        title: title,
                        type: selectedQuestionType,
                        answerChoices: choices,
                        required: required,
                        id: uuidv4(),
                      },
                    ]);
                    break;
                  case questionType.agreement:
                    setQuestions((oldQuestions: FormQuestion[]) => [
                      ...oldQuestions,
                      {
                        title: title,
                        type: selectedQuestionType,
                        required: required,
                        mustAgree: mustAgree,
                        id: uuidv4(),
                      },
                    ]);
                    break;
                  case questionType.file:
                    setQuestions((oldQuestions: FormQuestion[]) => [
                      ...oldQuestions,
                      {
                        title: title,
                        type: selectedQuestionType,
                        allowedFileTypes: allowedFileTypes,
                        allowAllTypes: !allowCertainFiles,
                        maximumFileSize: maxFileSize.current,
                        maximumFiles: maxFiles.current,
                        required: required,
                        id: uuidv4(),
                      },
                    ]);
                    break;
                  default:
                    setQuestions((oldQuestions: FormQuestion[]) => [
                      ...oldQuestions,
                      {
                        title: title,
                        type: selectedQuestionType,
                        required: required,
                        id: uuidv4(),
                      },
                    ]);
                }
              }}
            >
              <IconRubberStamp className='w-5' stroke={1.25} />
            </button>
          </Tooltip>
        </div>
      </Stack>
    </div>
  );
}
