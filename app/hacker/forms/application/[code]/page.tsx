'use client';

import { useState, useEffect } from 'react';
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
} from '@mantine/core';
import { useForm, UseFormReturnType, isEmail, isNotEmpty, } from '@mantine/form';
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
import { getApplication, getFormResponse, saveResponse, submitResponse } from '@/app/actions/Forms';
import {
	Question as QuestionInterface,
	Agreement,
	FormSection,
	Application,
	ApplicationResponse,
} from '@/types/forms';
import { application, mantineForm, MantineForm } from '@/forms/application';
import { Form, Competition } from '@prisma/client';

function Question({ question, form }: { question: QuestionInterface, form: UseFormReturnType<Record<string, any>> }) {
	const [file, setFile] = useState<File | null>(null);
	switch (question.type) {
		case questionType.shortResponse:
		case questionType.email:
			return (
				<TextInput
					label={question.title}
					description={question.description}
					required={question.settings.required}
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
					resize="vertical"
					key={form.key(question.key)}
					{...form.getInputProps(question.key)}
				/>
			)
		case questionType.multiplechoice:
			return (
				<Radio.Group
					label={question.title}
					description={question.description}
					required={question.settings.required}
					key={form.key(question.key)}
					{...form.getInputProps(question.key)}
				>
					<Stack className="mt-2">
						{question.choices?.map((choice: string, index: number) => {
							return (
								<Radio key={index} label={choice} value={choice} />
							);
						})}
					</Stack>
				</Radio.Group>
			)

		case questionType.checkbox:
			return (
				<Checkbox.Group
					label={question.title}
					description={question.description}
					required={question.settings.required}
					key={form.key(question.key)}
					{...form.getInputProps(question.key)}
				>
					<Stack className="mt-2">
						{question.choices?.map((choice: string, index: number) => {
							return (
								<Checkbox key={index} label={choice} value={choice} />
							);
						})}
					</Stack>
				</Checkbox.Group>
			)

		case questionType.dropdown:
			return (
				<Select
					label={question.title}
					description={question.description}
					required={question.settings.required}
					data={question.choices}
					key={form.key(question.key)}
					{...form.getInputProps(question.key)}
					searchable
				/>
			)

		case questionType.agreement:
			return (
				<Checkbox
					label={question.title}
					description={question.description}
					required={question.settings.required}
					key={form.key(question.key)}
					{...form.getInputProps(question.key)}
				/>
			)
		case questionType.phone:
			return (
				<div key={question.key}>
					<Text size='sm'>
						{question.title}{' '}
						<span className='text-[var(--mantine-color-red-8)]'>
							{' '}
							*
						</span>
					</Text>
					<PhoneInput
						defaultCountry='us'
						placeholder='Enter your phone number'
					/>
				</div>
			);
		case questionType.file:
			return (
				<Stack gap="sm">
					<FileInput accept="image/png,image/jpeg" label={question.title} description={question.description} required={question.settings.required} placeholder="Upload files" value={file} onChange={setFile} />
					{file && (
						<Text size="sm" ta="center">
							Picked file: {file.name}
						</Text>
					)}
				</Stack>
			)
		default:
			return (
				<h1 key={form.key(question.key)}>Not implemented yet</h1>
			)
	}
}

export default function ViewForm({ params }: { params: { formId: string } }) {
	const phoneUtil = PhoneNumberUtil.getInstance();
	const [isValid, setIsValid] = useState(false);
	const [formSections, setFormSections] = useState<FormSection[]>([]);
	const [phone, setPhone] = useState('');
	const userId = 'test-user';

	const form = useForm<Record<string, any>>({
		mode: 'uncontrolled',
		initialValues: {},
	});

	useEffect(() => {
		getApplication('SWAMPHACKS-X').then((resp) => {
			console.log(resp);
			if (!resp || !resp.application?.sections) {
				return;
			}
			const application: Form = resp.application;
			const sections = resp.application.sections as unknown as FormSection[];
			setFormSections(sections);
			const initialValues: Record<string, any> = {};
			sections.forEach((section: FormSection) => {
				section.questions.forEach((question: QuestionInterface) => {
					switch (question.type) {
						case questionType.checkbox:
						case questionType.agreement:
							initialValues[question.key] = false;
							break;
						default:
							initialValues[question.key] = '';
							break;
					}
				});
			});
			form.reset();
			form.setInitialValues({ values: initialValues });

			// getFormResponse(application.id, userId).then((resp: ApplicationResponse) => {
			// 	const values: Record<string, any> = {};
			// 	for (const response of resp.general) {
			// 		values[response.key] = response.value;
			// 		console.log(response.key, response.value);
			// 	}
			// 	for (const response of resp.agreements) {
			// 		values[response.key] = response.value;
			// 		console.log(response.key, response.value);
			// 	}
			// 	Object.entries(resp.sections).forEach(([key, section]) => {
			// 		for (const response of section) {
			// 			values[response.key] = response.value;
			// 		}
			// 	});
			// 	console.log(values);
			// 	form.setValues(values);
			// 	form.resetDirty();
			// });
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

	const handleSubmit = (values: any) => { };

	return (
		<form onSubmit={handleSubmit}>
			<div className='flex flex-col items-center'>
				<div className='m-[5rem] grid w-[30rem] grid-cols-1 gap-4'>
					{formSections.map((section: FormSection, index: number) => {
						return (
							<div key={index}>
								{/* Title and description */}
								<Title order={1}>{section.title}</Title>
								{section.description ? (
									<Text>{section.description}</Text>
								) : null}
								<Divider my="md" />

								{/* Questions */}
								<Stack>
									{section.questions.map((question: QuestionInterface) => {
										return (
											<Question key={question.key} question={question} form={form} />
										)
									})}
								</Stack>
							</div>
						)
					})}
				</div>
			</div>
		</form>
	);
}
