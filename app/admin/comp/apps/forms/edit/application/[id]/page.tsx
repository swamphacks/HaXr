'use client';

import { useState, useEffect, useRef } from 'react';
import {
	Box,
	Button,
	Stack,
	Tabs,
	rem,
	Text,
	Accordion,
	Checkbox,
	Switch,
	Divider,
	Modal,
	Select,
	TextInput,
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
	FormSection as FormSection,
	QuestionSettings,
} from '@/types/forms';
import { getForm, updateForm, updateFormSettings, publishForm } from '@/app/actions/Forms';
import { Form } from '@prisma/client';
import { JsonArray, JsonObject } from '@prisma/client/runtime/library';
import { StatusIndicator } from '@/types/forms';
import Status from '@/components/status';
import { sectionEquals, recordEquals } from '@/utils/saveUtils';
import useStateWithRef from '@/utils/stateWithRef';

function Section({
	setSections,
	section,
	published,
}: {
	setSections: React.Dispatch<React.SetStateAction<FormSection[]>>;
	section: FormSection;
	published: boolean;
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

	const handleSectionTitleChange = (e: any) => {
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
		<Accordion.Item key={section.key} value={section.key}>
			<Accordion.Control>{section.title}</Accordion.Control>
			<Accordion.Panel>
				<Stack align='center'>
					<TextInput
						onChange={handleSectionTitleChange}
						className='w-[48rem]'
						label='Section	Title'
						defaultValue={section.title}
						placeholder='Untitled Section'
						disabled={published}
					/>
					<TextInput
						onChange={handleSectionDescriptionChange}
						className='w-[48rem]'
						label='Section	Description'
						defaultValue={section.description}
						placeholder='Enter Description'
						disabled={published}
					/>
					{section.questions.map((question: FormQuestion, index: number) => (
						<QuestionEdit
							disabled={published}
							key={index}
							question={question}
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
						disabled={published}
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
	const handleAddSection = () => {
		setSections([
			...((form.sections as JsonArray) ?? []),
			{
				key: uuidv4(),
				title: 'Unititled Section',
				description: '',
				questions: [],
			},
		] as unknown as FormSection[]);
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
						disabled={form.is_published}
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
				{sections.map((section: FormSection) => {
					return (
						<Section
							published={form.is_published}
							key={section.key}
							setSections={setSections}
							section={section}
						/>
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
		</>
	);
}

function Settings({
	form,
	setForm,
	sections,
	autosaveTimer,
	save,
}: {
	form: Form;
	setForm: any;
	sections: FormSection[];
	autosaveTimer: React.MutableRefObject<NodeJS.Timeout | undefined>;
	save: () => void;
}) {

	const [opened, { open, close }] = useDisclosure(false);
	const handleIncludeMLH = (e: any) => {
		setForm({ ...form, is_mlh: e.target.checked });
	}

	const handleRequireSubmission = (e: any) => {
		setForm({ ...form, required: e.target.checked });
	}

	const handleFormSettingsChange = async () => {
		close();
		const resp = await publishForm(form, sections);
		console.log(resp);
	}

	const handleUnpublish = async () => {
		if (autosaveTimer.current) {
			clearInterval(autosaveTimer.current);
		}

		const resp = await updateFormSettings({ ...form, is_published: false });
		console.log(resp);
		// DO NOT CHANGE THE ORDER OF UPDATE OTHERWISE IT BREAKS
		setForm({ ...form, is_published: false });

		autosaveTimer.current = setInterval(save, 1000);
		close();
	}

	return (
		<div className='flex flex-col items-center'>

			<Modal opened={opened} onClose={close} centered>
				{form.is_published ? (
					<>
						<Text size='md'>Are you sure you want to unpublish the form? <br /><br />Unpublishing the form will make it unavailable to the public. You can still edit the form settings and questions. </Text>
						<Button onClick={handleUnpublish} style={{ width: '100%', marginTop: '1rem' }} variant='light' color='red'>Unpublish Form</Button>
					</>) : (
					<>
						<Text size='md'>Are you sure you want to publish the form? <br /><br />Publishing the form will make it available to the public on its release date. Note that you <Text span fw={700} fs='italic'>cannot edit the questions</Text> or any settings that affect the questions once the form is published but can still edit the form settings.
						</Text>
						<Button onClick={handleFormSettingsChange} style={{ width: '100%', marginTop: '1rem' }} variant='light' color='green'>Publish</Button>
					</>
				)}
			</Modal>

			<div className='flex flex-col w-[30rem] gap-4'>
				<div className='flex flex-col gap-2'>
					<Switch
						defaultChecked={form.is_mlh}
						label='Include MLH Questions'
						description='MLH Questions are required for any registration forms such as the application.'
						onChange={handleIncludeMLH}
					/>
					<Switch
						defaultChecked={form.required}
						label='Require Submission'
						description='Require submission of this form to complete registration.'
						onChange={handleRequireSubmission}
					/>
				</div>

				<div className='flex flex-col gap-2'>
					<Divider label='Release Settings' />
					<DateTimePicker
						description='The date and time the form will be released. If no date is set, the form will be released immediately upon its publishing.'
						defaultValue={form.opens_at}
						valueFormat="MMM DD YYYY hh:mm A"
						placeholder='Select a date and time'
						label='Release Date'
					/>
					<DateTimePicker
						description='The date and time the form will be closed.'
						defaultValue={form.closes_at}
						valueFormat="MMM DD YYYY hh:mm A"
						placeholder='Select a date and time'
						label='Close Date'
						required
					/>
				</div>

				<div>
					{form.is_published ?
						<>
							<Button onClick={open} style={{ width: '100%', marginBottom: '0.5rem' }} color='red' variant='light'>Unpublish Form</Button>
							<p className='text-[var(--mantine-color-dimmed)] text-xs'>
								Unpublishing the form will make it unavailable to the public. You can still edit the form settings and questions.
							</p>
						</>
						: (
							<>
								<Button onClick={open} style={{ width: '100%', marginBottom: '0.5rem' }} color='green' variant='light'>Publish Form</Button>
								<p className='text-[var(--mantine-color-dimmed)] text-xs'>Publishing the form will make it available to the public on its release date. Note that you cannot edit the questions or any settings that affect the questions once the form is published but can still edit the form settings.</p></>)}
				</div>
			</div>
		</div>
	)
}

export default function CreateApplication({
	params,
}: {
	params: { id: string };
}) {
	const iconStyle = { width: rem(12), height: rem(12) };
	const [form, setForm, formRef] = useStateWithRef<Form>();
	const [sections, setSections, sectionsRef] = useStateWithRef<FormSection[]>(
		[]
	);
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
			if (
				formRef.current &&
				sectionsRef.current
			) {
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
						await updateForm(
							formRef.current,
							sectionsRef.current
						);
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
						console.log('saved settings')
					}
				}

			}
		} catch (e) {
			setStatus(StatusIndicator.FAILED);
			console.log(e);
		}
	}

	useEffect(() => {
		getForm(params.id).then((res) => {
			if (res) {
				setForm(res);
				setSections(res.sections as unknown as FormSection[]);
				setStatus(StatusIndicator.SUCCESS);
				console.log(res);

				autosaveTimer.current = setInterval(save, 1000);

			} else {
				setStatus(StatusIndicator.FAILED);
			}
		});

		return () => {
			if (autosaveTimer.current) {
				clearInterval(autosaveTimer.current);
			}
		};
	}, [params.id]);

	return (
		<>
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
					{form && sections ? (
						<Settings
							form={form}
							setForm={setForm}
							sections={sections}
							autosaveTimer={autosaveTimer}
							save={save}
						/>
					) : (
						null
					)}
				</Tabs.Panel>
			</Tabs>
		</>
	);
}
