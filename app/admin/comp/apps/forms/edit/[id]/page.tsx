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
	Select
} from '@mantine/core';
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
import { saveForm } from '@/app/actions/Forms';
import { Prisma, Form, FormSettings, Group } from '@prisma/client';
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
	}

	const handleDragged = (event: any) => {
		const { active, over } = event;
		if (active.id === over.id) return;

		setForm((oldForm: Form) => {
			const questions: BaseQuestion[] = oldForm.questions as Prisma.JsonArray as unknown as FormQuestion[];
			const originalPos = getArrayPos(
				questions,
				active.id
			);
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
					<input placeholder='Untitled Form' defaultValue={form.title}
						onChange={(e) => setForm((oldForm: Form) => { return { ...oldForm, title: e.target.value } })}
						className={classes.title} />
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
									const question: FormQuestion = q as Prisma.JsonValue as unknown as FormQuestion;
									return question.mlh
										? <Question key={question.id} question={question} disabled />
										: null
								}
								)}
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
				<Button onClick={async () => {
					const resp = await saveForm(form, questions, formSettings);
					console.log(resp);
				}}>Save Form</Button>
			</Stack>
		</>
	);
}

function Settings({ settings, setSettings }: { settings: FormSettings, setSettings: any }) {
	const open_time = useRef(settings.schedule_open
		? new Date(settings.schedule_open)
		: new Date());
	const close_time = useRef(settings.schedule_close
		? new Date(settings.schedule_close)
		: new Date());

	const handleScheduleChoice = (e: any, timeRef: any) => {
		if (!e.target.checked) {
			timeRef.current = settings.schedule_open || timeRef.current;
		}
	}

	return (
		<div className='mt-8 flex flex-col items-stretch gap-4' >
			<Checkbox
				defaultChecked={settings.include_mlh}
				onChange={(e) =>
					setSettings((oldSettings: FormSettings) => {
						return { ...oldSettings, include_mlh: e.target.checked }
					})
				}
				label='Include MLH Questions'
			/>
			<div>
				<Switch
					defaultChecked={settings.schedule_open ? true : false}
					onChange={(e) => {
						handleScheduleChoice(e, open_time)
						setSettings((oldSettings: FormSettings) => {
							return {
								...oldSettings,
								schedule_open: e.target.checked ? open_time.current : null,
							}
						})
					}}
					label='Schedule form open time'
				/>
				<DateTimePicker
					className='mt-2'
					valueFormat='MM/DD/YYYY hh:mm A'
					defaultValue={open_time.current}
					placeholder='Select date and time to open the form'
					disabled={settings.schedule_open ? false : true}
					onChange={(e) =>
						setSettings((oldSettings: FormSettings) => {
							return { ...oldSettings, schedule_open: e }
						})
					}
				/>
			</div>


			<div>
				<Switch
					defaultChecked={settings.schedule_close ? true : false}
					onChange={(e) => {
						handleScheduleChoice(e, close_time)
						setSettings((oldSettings: FormSettings) => {
							return {
								...oldSettings,
								schedule_close: e.target.checked ? close_time.current : null,
							}
						})
					}}
					label='Schedule form close time'
				/>
				<DateTimePicker
					className='mt-2'
					valueFormat='MM/DD/YYYY hh:mm A'
					defaultValue={close_time.current}
					placeholder="Select date and time to close the form"
					disabled={settings.schedule_close ? false : true}
					onChange={(e) =>
						setSettings((oldSettings: FormSettings) => {
							return { ...oldSettings, schedule_close: e }
						})
					}
				/>
			</div>
			<Select
				defaultValue={settings.form_for}
				label='Who is the form for?'
				placeholder='Select group'
				data={Object.values(Group).filter((g) => typeof g === 'string')}
			/>
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
					setQuestions(data.questions as Prisma.JsonArray as unknown as FormQuestion[]);
					setFormSettings(data.form_settings);
					setLoadingStatus('loaded');
				});
			} else if (res.status === 404) {
				setLoadingStatus('not found');
			} else {
				setLoadingStatus('error')
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
				{form ?
					<FormCreator
						form={form}
						setForm={setForm}
						questions={questions}
						setQuestions={setQuestions}
						formSettings={formSettings}
					/> : <h1>{loadingStatus}</h1>}
			</Tabs.Panel>

			<Tabs.Panel value='messages'>
				{form ?
					<h1> Responses tab content </h1>
					: <h1>{loadingStatus}</h1>}
			</Tabs.Panel>

			<Tabs.Panel value='settings'>
				{form ?
					<Settings settings={formSettings} setSettings={setFormSettings} />
					: <h1>{loadingStatus}</h1>}
			</Tabs.Panel>
		</Tabs>
	);
}
