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
} from '@mantine/core';
import { useForm, UseFormReturnType } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { DateTimePicker } from '@mantine/dates';
import {
	IconForms,
	IconMessageCircle,
	IconSettings,
} from '@tabler/icons-react';
import QuestionEdit from '@/components/admin/Question';
import classes from '@/styles/Input.module.css';
import { v4 as uuidv4 } from 'uuid';
import accordionClasses from '@/styles/CreateForm.module.css';
import { questionType } from '@/types/questionTypes';
import {
	Question as FormQuestion,
	Section as FormSection,
} from '@/types/forms';
import { updateForm } from '@/app/actions/Forms';
import { Prisma, Form, FormSettings } from '@prisma/client';
import { BaseQuestion } from '@/types/questionTypes';

function Section({
	setSections,
	section,
}: {
	setSections: React.Dispatch<React.SetStateAction<FormSection[]>>;
	section: FormSection;
}) {
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

	const setQuestions = () => { };

	return (
		<Accordion.Item key={section.key} value={section.key}>
			<Accordion.Control>{section.title}</Accordion.Control>
			<Accordion.Panel>
				<Stack>
					{section.questions.map((question: FormQuestion, index: number) => (
						<QuestionEdit
							key={index}
							question={question}
							setQuestion={(newQuestion: FormQuestion) => {
								setSections((oldSections: FormSection[]) => {
									return oldSections.map((oldSection: FormSection) => {
										if (oldSection.key === section.key) {
											return {
												...oldSection,
												questions: oldSection.questions.map((oldQuestion: FormQuestion) => {
													if (oldQuestion.key === question.key) {
														return newQuestion;
													}
													return oldQuestion;
												}),
											};
										}
										return oldSection;
									});
								});
							}}
						/>
					))}
					<Button onClick={handleAddQuestion}>Add Question</Button>
				</Stack>
			</Accordion.Panel>
		</Accordion.Item>
	);
}

function ApplicationCreator({
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
	const [sections, setSections] = useState<FormSection[]>([]);

	const handleAddSection = () => {
		setSections((oldSections) => {
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
				<Accordion.Item key='General' value='General Questions'>
					<Accordion.Control>General</Accordion.Control>
					<Accordion.Panel>
						<Stack gap='md' align='center' justify='flex-start'></Stack>
					</Accordion.Panel>
				</Accordion.Item>
				{sections.map((section: FormSection) => {
					return (
						<Section
							key={section.key}
							setSections={setSections}
							section={section}
						/>
					);
				})}
			</Accordion>

			<Stack gap='md' align='center' justify='flex-start' className='mt-4'>
				<Button onClick={handleAddSection}>Add Section</Button>
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

export default function CreateApplication({
	params,
}: {
	params: { id: string };
}) {
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
					<ApplicationCreator
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
