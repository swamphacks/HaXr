'use client';

import { useState, useEffect, useRef } from 'react';
import {
	TextInput,
	Textarea,
	Select,
	Checkbox,
	Divider,
	Stack,
	Button,
	Group,
	Text,
	Title,
	Radio,
	FileInput,
	Modal,
} from '@mantine/core';
import { useForm, UseFormReturnType, isEmail, isNotEmpty } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import {
	ageChoices,
	schools,
	levelOfStudies,
	countries,
	questionType,
} from '@/types/questionTypes';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { PhoneNumberUtil } from 'google-libphonenumber';
import {
	getApplication,
	getFormResponse,
	saveResponse,
	submitResponse,
} from '@/app/actions/Forms';
import {
	Question as QuestionInterface,
	Agreement,
	FormSection,
	Application,
	ApplicationResponse,
	StatusIndicator,
} from '@/types/forms';
import { mlhQuestions, mantineForm, MantineForm } from '@/forms/application';
import { Form, Competition } from '@prisma/client';
import Status from '@/components/status';
import useStateWithRef from '@/utils/stateWithRef';

function Question({
	question,
	form,
	disabled,
}: {
	question: QuestionInterface;
	form: UseFormReturnType<Record<string, any>>;
	disabled: boolean;
}) {
	const [file, setFile] = useState<File | null>(null);
	switch (question.type) {
		case questionType.shortResponse:
		case questionType.email:
			return (
				<TextInput
					label={question.title}
					description={question.description}
					required={question.settings.required}
					placeholder={question.placeholder ?? 'Enter response'}
					disabled={disabled}
					key={form.key(question.key)}
					{...form.getInputProps(question.key)}
				/>
			);
		case questionType.paragraph:
			return (
				<Textarea
					label={question.title}
					description={question.description}
					required={question.settings.required}
					placeholder={question.placeholder ?? 'Enter response'}
					resize='vertical'
					disabled={disabled}
					key={form.key(question.key)}
					{...form.getInputProps(question.key)}
				/>
			);
		case questionType.multiplechoice:
			return (
				<Radio.Group
					label={question.title}
					description={question.description}
					required={question.settings.required}
					key={form.key(question.key)}
					{...form.getInputProps(question.key)}
				>
					<Stack className='mt-2'>
						{question.choices?.map((choice: string, index: number) => {
							return (
								<Radio
									key={index}
									label={choice}
									value={choice}
									disabled={disabled}
								/>
							);
						})}
					</Stack>
				</Radio.Group>
			);

		case questionType.checkbox:
			return (
				<Checkbox.Group
					label={question.title}
					description={question.description}
					required={question.settings.required}
					key={form.key(question.key)}
					{...form.getInputProps(question.key, { type: 'checkbox' })}
				>
					<Stack className='mt-2'>
						{question.choices?.map((choice: string, index: number) => {
							return (
								<Checkbox
									key={index}
									label={choice}
									value={choice}
									disabled={disabled}
								/>
							);
						})}
					</Stack>
				</Checkbox.Group>
			);

		case questionType.dropdown:
			return (
				<Select
					label={question.title}
					description={question.description}
					required={question.settings.required}
					placeholder={question.placeholder ?? 'Select an option'}
					data={question.choices}
					disabled={disabled}
					key={form.key(question.key)}
					{...form.getInputProps(question.key)}
					searchable
				/>
			);

		case questionType.agreement:
			return (
				<Checkbox
					label={question.title}
					description={question.description}
					required={question.settings.required}
					key={form.key(question.key)}
					disabled={disabled}
					{...form.getInputProps(question.key, { type: 'checkbox' })}
				/>
			);
		case questionType.phone:
			return (
				<div key={question.key}>
					<Text size='sm'>
						{question.title}{' '}
						<span className='text-[var(--mantine-color-red-8)]'> *</span>
					</Text>
					<PhoneInput
						defaultCountry='us'
						disabled={disabled}
						placeholder='Enter your phone number'
					/>
				</div>
			);
		case questionType.file:
			return (
				<Stack gap='sm'>
					<FileInput
						accept='image/png,image/jpeg'
						label={question.title}
						description={question.description}
						required={question.settings.required}
						placeholder='Upload files'
						disabled={disabled}
						value={file}
						onChange={setFile}
					/>
					{file && (
						<Text size='sm' ta='center'>
							Picked file: {file.name}
						</Text>
					)}
				</Stack>
			);
		default:
			return <h1 key={form.key(question.key)}>Not implemented yet</h1>;
	}
}

function Section({
	section,
	form,
	submitted,
}: {
	section: FormSection;
	form: UseFormReturnType<Record<string, any>>;
	submitted: boolean;
}) {
	return (
		<div>
			{/* Title and description */}
			<div className='mb-[8px] flex flex-col'>
				<Title order={2}>{section.title}</Title>
				{section.description ? <Text>{section.description}</Text> : null}
				<Divider my='md' />
			</div>

			{/* Questions */}
			<Stack>
				{section.questions.map((question: QuestionInterface) => {
					return (
						<Question
							key={question.key}
							question={question}
							form={form}
							disabled={submitted}
						/>
					);
				})}
			</Stack>
		</div>
	);
}

function arrayEquals(a: string[], b: string[]) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length !== b.length) return false;

	for (let i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}

function recordEquals(a: Record<string, any>, b: Record<string, any>) {
	// Compare the keys
	if (!arrayEquals(Object.keys(a), Object.keys(b))) return false;

	for (const key in a) {
		if (
			Array.isArray(a[key]) &&
			Array.isArray(b[key]) &&
			!arrayEquals(a[key], b[key])
		)
			return false;
		else if (b[key] !== a[key]) return false;
	}

	return true;
}

export default function ViewForm({ params }: { params: { formId: string } }) {
	const phoneUtil = PhoneNumberUtil.getInstance();
	const [isValid, setIsValid] = useState(false);
	const [modalOpened, { open, close }] = useDisclosure(false);
	const [status, setStatus] = useState<StatusIndicator>(
		StatusIndicator.LOADING
	);
	const [formSections, setFormSections] = useState<FormSection[]>([]);
	const [formObject, setFormObject] = useState<Form>();
	const [submitted, setSubmitted] = useState(false);
	const [loadingVisible, { toggle }] = useDisclosure(false);
	const submittedRef = useRef(false);
	const prevValues = useRef<Record<string, any>>({});
	const responseId = useRef<string>('');
	const [phone, setPhone] = useState('');
	const userId = 'test-user';

	const form = useForm<Record<string, any>>({
		mode: 'uncontrolled',
		initialValues: {},
	});

	const autosave = async () => {
		try {
			const currentValues = form.getValues();
			const prev = prevValues.current;
			const currId = responseId.current;

			// Only save if there are changes
			if (!recordEquals(prev, currentValues)) {
				await saveResponse(currId, currentValues);
				prevValues.current = currentValues;
				setStatus(StatusIndicator.SUCCESS);
				console.log('Autosaved');
			} else {
				console.log('no changes - not saved');
			}
		} catch (error) {
			console.log(error);
			setStatus(StatusIndicator.FAILED);
		}

		if (!submittedRef.current) {
			setTimeout(autosave, 1000);
		}
	};

	useEffect(() => {
		toggle();
		getApplication('SWAMPHACKS-X').then((resp) => {
			console.log(resp);
			if (!resp || !resp.application?.sections) {
				return;
			}
			const application: Form = resp.application;
			setFormObject(application);
			const sections = resp.application.sections as unknown as FormSection[];
			setFormSections(sections);

			getFormResponse(application.id, 'test-user', prevValues).then((resp) => {
				responseId.current = resp.id;
				const values = resp.answers as unknown as Record<string, any>;
				prevValues.current = values;
				form.setValues(values);
				console.log(values);

				if (!resp.submitted) {
					// Autosave every second
					setStatus(StatusIndicator.SUCCESS);
					setTimeout(autosave, 1000);
				} else {
					setStatus(StatusIndicator.SUBMITTED);
				}
				setSubmitted(resp.submitted);
				submittedRef.current = resp.submitted;
			});
		});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const isPhoneValid = (phone: string) => {
		try {
			return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
		} catch (error) {
			console.log(phone);
			console.log('not valid phone number');
			return false;
		}
	};

	const handlePhoneChange = (value: string) => {
		setPhone(value);
		form.setFieldValue('phoneNumber', value);
	};

	const handleSubmit = async () => {
		toggle();
		submittedRef.current = true; // Stop autosave
		const resp = await submitResponse(responseId.current, form.getValues());
		setSubmitted(true);
		setStatus(StatusIndicator.SUBMITTED);
		toggle();
		console.log(resp);
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				{/* Submission Modal */}
				<Modal opened={modalOpened} onClose={close} title='Submit Form'>
					<Text style={{ marginBottom: '12px' }}>
						Are you sure you want to submit your application? You will not be able
						to edit it after submission.
					</Text>
					<Group justify='center'>
						<Button
							color='green'
							variant='light'
							onClick={() => {
								handleSubmit();
								close();
							}}
						>
							Submit
						</Button>
					</Group>
				</Modal>

				<div className='my-16 grid grid-cols-[auto_40rem_auto] items-center'>
					<div />
					{formObject ? (
						<div className='flex flex-col items-center gap-8'>
							<div className='mb-8 grid w-full grid-cols-2'>
								{/* Title */}
								<Title order={1}>{formObject?.title}</Title>

								{/* Form status */}
								<div className='justify-self-end'>
									<Status status={status} />
								</div>
							</div>

							{/* Form sections */}
							<div className='flex w-full flex-col gap-8'>
								{formObject.is_mlh ? (
									<Section
										section={mlhQuestions.general}
										form={form}
										submitted={submitted}
									/>
								) : null}
								{formSections.map((section: FormSection) => {
									return (
										<Section
											key={section.key}
											section={section}
											form={form}
											submitted={submitted}
										/>
									);
								})}
								{formObject.is_mlh ? (
									<Section
										section={mlhQuestions.agreements}
										form={form}
										submitted={submitted}
									/>
								) : null}
							</div>

							{/* Submit */}
							<Button
								variant='light'
								color='green'
								onClick={open}
								disabled={submitted}
							>
								Submit Form
							</Button>
						</div>
					) : (
						<div className='justify-self-end'>
							<Status status={status} />
						</div>
					)}
				</div>
				<div />
			</form>
		</>
	);
}
