'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Stack,
  Tabs,
  rem,
  Accordion,
  Checkbox,
  Switch,
  Divider,
  Modal,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DateTimePicker } from '@mantine/dates';
import {
  IconForms,
  IconMessageCircle,
  IconSettings,
  IconPlus,
} from '@tabler/icons-react';
import Question from '@/components/admin/Question';
import classes from '@/styles/Input.module.css';
import Droppable from '@/components/dnd/Droppable';
import {
  DndContext,
  closestCorners,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensors,
  useSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';
import accordionClasses from '@/styles/CreateForm.module.css';
import Image from 'next/image';
import { FormQuestion, questionType } from '@/types/questionTypes';
import { updateForm } from '@/app/actions/Forms';
import { Prisma, Form, FormSettings } from '@prisma/client';
import { BaseQuestion, requiredQuestions } from '@/types/questionTypes';

function FormCreator({
  form,
  setForm,
  questions,
  setQuestions,
  formSettings,
}: {
  form: Form;
  setForm: any;
  questions: FormQuestion[];
  setQuestions: any;
  formSettings: FormSettings;
}) {
  const handleAddQuestions = () => {
    setQuestions(() => {
      return [
        ...questions,
        {
          title: '',
          type: questionType.shortResponse,
          required: false,
          id: uuidv4(),
        },
      ];
    });
  };

  const getArrayPos = (array: any[], id: string) => {
    return array.findIndex((el: any) => el.id === id);
  };

  const handleDragged = (event: any) => {
    const { active, over } = event;
    if (active.id === over.id) return;

    setForm((oldForm: Form) => {
      const questions: BaseQuestion[] =
        oldForm.questions as Prisma.JsonArray as unknown as FormQuestion[];
      const originalPos = getArrayPos(questions, active.id);
      const newPos = getArrayPos(questions, over.id);
      return {
        ...oldForm,
        questions: arrayMove(questions, originalPos, newPos),
      };
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <>
      <Stack gap='md' align='center' justify='flex-start'>
        <Box w={rem(500)}>
          <input
            placeholder='Untitled Form'
            defaultValue={form.title}
            onChange={(e) =>
              setForm((oldForm: Form) => {
                return { ...oldForm, title: e.target.value };
              })
            }
            className={classes.title}
          />
        </Box>
      </Stack>

      <Accordion
        transitionDuration={500}
        classNames={{
          label: accordionClasses.label,
          panel: accordionClasses.panel,
        }}
      >
        {formSettings.include_mlh ? (
          <Accordion.Item key='MLH' value='MLH Questions'>
            <Accordion.Control
              icon={
                <Image
                  src='/logos/mlh-logo-color.svg'
                  alt='MLH Logo'
                  width={70}
                  height={70}
                />
              }
            >
              MLH Questions
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap='md' align='center' justify='flex-start'>
                {(form.questions as Prisma.JsonArray).map((q) => {
                  const question: FormQuestion =
                    q as Prisma.JsonValue as unknown as FormQuestion;
                  return question.mlh ? (
                    <Question key={question.id} question={question} can_edit />
                  ) : null;
                })}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        ) : null}

        <Accordion.Item key='Additional' value='Additional Questions'>
          <Accordion.Control
            icon={<IconPlus stroke={1} className='h-10 w-10' />}
          >
            Additional Questions
          </Accordion.Control>
          <Accordion.Panel>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragEnd={handleDragged}
            >
              <Droppable id='droppable2'>
                <Stack gap='md' align='center' justify='flex-start'>
                  <SortableContext
                    items={questions}
                    strategy={verticalListSortingStrategy}
                  >
                    {questions.map((q: FormQuestion) =>
                      !q.mlh ? (
                        <Question
                          key={q.id}
                          question={q}
                          setQuestions={setQuestions}
                        />
                      ) : null
                    )}
                  </SortableContext>
                  <Button
                    variant='light'
                    color='gray'
                    onClick={handleAddQuestions}
                  >
                    Add Question
                  </Button>
                </Stack>
              </Droppable>
            </DndContext>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <Stack gap='md' align='center' justify='flex-start' className='mt-4'>
        <Button
          onClick={async () => {
            const resp = await updateForm(form, questions, formSettings);
            console.log(resp);
          }}
        >
          Save Form
        </Button>
      </Stack>
    </>
  );
}

function Settings({
  form,
  setForm,
  questions,
  settings,
  setSettings,
}: {
  form: Form;
  setForm: any;
  questions: FormQuestion[];
  settings: FormSettings;
  setSettings: any;
}) {
  const open_time = useRef(
    settings.opens_at ? new Date(settings.opens_at) : new Date()
  );
  const close_time = useRef(
    settings.closes_at ? new Date(settings.closes_at) : new Date()
  );
  const [is_unpublish_open, { open: open_unpublish, close: close_unpublish }] =
    useDisclosure(false);
  const [is_publish_open, { open: open_publish, close: close_publish }] =
    useDisclosure(false);
  const [canUpdatePublish, setUpdatePublish] = useState(false);

  const handleScheduleChoice = (e: any, timeRef: any) => {
    if (!e.target.checked) {
      timeRef.current = settings.opens_at || timeRef.current;
    }
  };

  return (
    <div className='mt-8 grid grid-cols-[0.5fr_1fr_0.5fr]'>
      <div></div>
      <div className='flex flex-col gap-4'>
        <Checkbox
          defaultChecked={settings.include_mlh}
          onChange={(e) =>
            setSettings((oldSettings: FormSettings) => {
              return { ...oldSettings, include_mlh: e.target.checked };
            })
          }
          label='Include MLH Questions'
        />

        <Divider />

        <div>
          <Switch
            defaultChecked={settings.opens_at ? true : false}
            onChange={(e) => {
              handleScheduleChoice(e, open_time);
              setSettings((oldSettings: FormSettings) => {
                return {
                  ...oldSettings,
                  opens_at: e.target.checked ? open_time.current : null,
                };
              });
            }}
            label='Schedule form open time'
          />
          <DateTimePicker
            className='mt-2'
            valueFormat='MM/DD/YYYY hh:mm A'
            defaultValue={open_time.current}
            placeholder='Select date and time to open the form'
            disabled={settings.opens_at ? false : true}
            onChange={(e) =>
              setSettings((oldSettings: FormSettings) => {
                return { ...oldSettings, opens_at: e };
              })
            }
          />
        </div>

        <Divider />

        <div>
          <Switch
            defaultChecked={settings.closes_at ? true : false}
            onChange={(e) => {
              handleScheduleChoice(e, close_time);
              setSettings((oldSettings: FormSettings) => {
                return {
                  ...oldSettings,
                  closes_at: e.target.checked ? close_time.current : null,
                };
              });
            }}
            label='Schedule form close time'
          />
          <DateTimePicker
            className='mt-2'
            valueFormat='MM/DD/YYYY hh:mm A'
            defaultValue={close_time.current}
            placeholder='Select date and time to close the form'
            disabled={settings.closes_at ? false : true}
            onChange={(e) =>
              setSettings((oldSettings: FormSettings) => {
                return { ...oldSettings, closes_at: e };
              })
            }
          />
        </div>

        <Divider />

        <Switch
          label='Required'
          defaultChecked={settings.required}
          onChange={(e) =>
            setSettings((oldSettings: FormSettings) => {
              return { ...oldSettings, required: e.target.checked };
            })
          }
        />
        <Switch
          label='Allow anyonymous responses'
          defaultChecked={settings.allow_anonymous}
          onChange={(e) =>
            setSettings((oldSettings: FormSettings) => {
              return { ...oldSettings, allow_anonymous: e.target.checked };
            })
          }
        />

        <Divider />

        {form.is_published ? (
          <Button variant='light' color='red' onClick={open_unpublish}>
            Unpublish
          </Button>
        ) : (
          <Button variant='light' color='green' onClick={open_publish}>
            Publish
          </Button>
        )}

        <Modal opened={is_publish_open} onClose={close_publish}>
          <div className='flex flex-col justify-center'>
            <h1>Are you sure you want to unpublish this form?</h1>
            <h1 className='font-bold'>
              To confirm, type &quot;{form.title}&quot; in the box below to
              confirm
            </h1>
            <input
              type='text'
              className='mt-4 h-8 w-full rounded-lg border border-green-600 bg-transparent pl-2 text-white'
              onInput={(e) => {
                setUpdatePublish(e.target.value === form.title);
              }}
              required
            />
            <Button
              variant='light'
              color='green'
              className='mt-4'
              disabled={!canUpdatePublish}
              onClick={async () => {
                const resp = await updateForm(
                  { ...form, is_published: true },
                  questions,
                  settings
                );
                console.log(resp);
                setForm({ ...form, is_published: true });
                close_publish();
                setUpdatePublish(false);
              }}
            >
              Publish
            </Button>
          </div>
        </Modal>

        <Modal opened={is_unpublish_open} onClose={close_unpublish}>
          <div className='flex flex-col justify-center'>
            <h1>
              Are you sure you want to unpublish this form? There are 0
              responses that will be deleted.
            </h1>
            <h1 className='font-bold'>
              To confirm, type &quot;{form.title}&quot; in the box below to
              confirm
            </h1>
            <input
              type='text'
              className='mt-4 h-8 w-full rounded-lg border border-red-600 bg-transparent pl-2 text-white'
              onInput={(e) => {
                setUpdatePublish(e.target.value === form.title);
              }}
              required
            />
            <Button
              variant='light'
              color='red'
              className='mt-4'
              disabled={!canUpdatePublish}
              onClick={async () => {
                const resp = await updateForm(
                  { ...form, is_published: false },
                  questions,
                  settings
                );
                console.log(resp);
                setForm({ ...form, is_published: false });
                close_unpublish();
                setUpdatePublish(false);
              }}
            >
              Unpublish
            </Button>
          </div>
        </Modal>
      </div>
      <div></div>
    </div>
  );
}

export default function CreateForm({ params }: { params: { id: string } }) {
  const iconStyle = { width: rem(12), height: rem(12) };

  const [formSettings, setFormSettings] = useState<FormSettings>();
  const [form, setForm] = useState<Form>();
  const [questions, setQuestions] = useState<FormQuestion[]>([]);
  const [loadingStatus, setLoadingStatus] = useState('loading');

  useEffect(() => {
    fetch(`/api/form/${params.id}`).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          setForm(data);
          setQuestions(
            data.questions as Prisma.JsonArray as unknown as FormQuestion[]
          );
          setFormSettings(data.form_settings);
          setLoadingStatus('loaded');
        });
      } else if (res.status === 404) {
        setLoadingStatus('not found');
      } else {
        setLoadingStatus('error');
      }
    });
  }, [params.id]);

  return (
    <Tabs defaultValue='gallery'>
      <Tabs.List justify='center'>
        <Tabs.Tab value='gallery' leftSection={<IconForms style={iconStyle} />}>
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
        {form ? (
          <FormCreator
            form={form}
            setForm={setForm}
            questions={questions}
            setQuestions={setQuestions}
            formSettings={formSettings}
          />
        ) : (
          <h1>{loadingStatus}</h1>
        )}
      </Tabs.Panel>

      <Tabs.Panel value='messages'>
        {form ? <h1> Responses tab content </h1> : <h1>{loadingStatus}</h1>}
      </Tabs.Panel>

      <Tabs.Panel value='settings'>
        {form ? (
          <Settings
            form={form}
            setForm={setForm}
            settings={formSettings}
            setSettings={setFormSettings}
          />
        ) : (
          <h1>{loadingStatus}</h1>
        )}
      </Tabs.Panel>
    </Tabs>
  );
}
