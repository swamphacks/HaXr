'use client';

import { useEffect, useRef, useState } from 'react';
import {
	Divider,
	Stack,
	Button,
	Group,
	Text,
	Title,
	Modal,
	Checkbox,
	Anchor
} from '@mantine/core';
import {
	FormSection,
	StatusIndicator,
	ShortResponseLength,
	MLHApplication,
	mlhQuestions,
} from '@/types/forms';
import {
	isValidEmail,
	initializeQuestion,
	isEmpty,
	recordEquals,
} from '@/utils/forms';
import { saveResponse, submitResponse } from '@/app/actions/forms';
import { Form, User, Response } from '@prisma/client';
import { useForm, UseFormReturnType } from '@mantine/form';
import { Question } from '@/components/forms/Questions';
import { notifications } from '@mantine/notifications';
import Status from '@/components/status';
import { QuestionType, Question as QuestionInterface } from '@/types/question';
import { useDisclosure } from '@mantine/hooks';
import { PhoneNumberUtil } from 'google-libphonenumber';

function SectionWrapper({ section, children }: { section: FormSection, children: React.ReactNode }) {
	return (
		<div>
			{/* Title and description */}
			<div className='mb-[8px] flex flex-col'>
				<Title order={2}>{section.title}</Title>
				{section.description && <Text>{section.description}</Text>}
				<Divider my='md' />
			</div>

			{/* Questions */}
			<Stack>
				{children}
			</Stack>
		</div>
	);
}

function Agreements({
	section,
	submitted,
	userResponses,
}: {
	section: FormSection;
	submitted: boolean;
	userResponses: UseFormReturnType<Record<string, any>>;
}) {
	const labels = [
		<>
			I have read and agree to the{' '}<Anchor target="_blank" href='https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md' inherit>MLH Code of Conduct</Anchor>
		</>,
		<>
			I authorize you to share my application/registration information with Major League Hacking for event administration, ranking, and MLH administration in-line with the <Anchor target='_blank' href='https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md' inherit>MLH Privacy Policy</Anchor>. I further agree to the terms of both the <Anchor inherit target='_blank' href='https://github.com/MLH/mlh-policies/blob/main/contest-terms.md'>MLH Contest Terms and Conditions</Anchor> and the <Anchor inherit target='_blank' href='https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md'>MLH Privacy Policy</Anchor></>,
		<>I authorize MLH to send me occasional emails about relevant events, career opportunities, and community announcements.</>
	];
	return (
		<SectionWrapper section={section}>
			{mlhQuestions.agreements.questions.map((question: QuestionInterface, i: number) =>
				<Checkbox
					label={labels[i]}
					disabled={submitted}
					required={question.settings.required}
					key={userResponses.key(question.key)}
					id={question.key}
					{...userResponses.getInputProps(question.key, { type: 'checkbox' })}
				/>
			)}
		</SectionWrapper>
	);
}

function Section({
	section,
	userResponses,
	submitted,
	competitionCode,
	formId,
	responseId,
}: {
	section: FormSection;
	userResponses: UseFormReturnType<Record<string, any>>;
	competitionCode: string;
	formId: string;
	responseId: string;
	submitted: boolean;
}) {
	return (
		<SectionWrapper section={section}>
			{section.questions.map((question: QuestionInterface) => {
				return (
					<Question
						key={question.key}
						question={question}
						competitionCode={competitionCode}
						formId={formId}
						responseId={responseId}
						form={userResponses}
						disabled={submitted}
					/>
				);
			})}
		</SectionWrapper>
	);
}

export default function FormContent({
	prismaForm,
	user,
	userResponse,
	mlhQuestions,
}: {
	prismaForm: Form;
	user: User;
	userResponse: Response;
	mlhQuestions: MLHApplication;
}) {
	const phoneUtil = PhoneNumberUtil.getInstance();
	const [modalOpened, { open, close }] = useDisclosure(false);
	const [submitted, setSubmitted] = useState(false);
	const [status, setStatus] = useState<StatusIndicator>(
		StatusIndicator.SUCCESS
	);
	const prevValues = useRef<Record<string, any>>({});
	const autosaveTimer = useRef<NodeJS.Timeout>();
	const currResponse = useForm<Record<string, any>>({
		mode: 'uncontrolled',
		initialValues: {},
	});

	// Sanity check - should never actually happen
	const formSections = prismaForm.sections as unknown as FormSection[];
	useEffect(() => {
		const transformed: Record<string, any> = {};
		const respValues = userResponse.values as unknown as Record<string, any>;

		formSections
			.flatMap((section: FormSection) => section.questions)
			.forEach((question: QuestionInterface) =>
				initializeQuestion(question, respValues, transformed)
			);

		if (prismaForm.is_mlh) {
			mlhQuestions.general.questions.forEach((question: QuestionInterface) =>
				initializeQuestion(question, respValues, transformed)
			);
			mlhQuestions.agreements.questions.forEach((question: QuestionInterface) =>
				initializeQuestion(question, respValues, transformed)
			);
		}

		prevValues.current = transformed;
		currResponse.initialize(transformed);

		const autosave = async () => {
			const currentValues = currResponse.getValues();
			const prev = prevValues.current;
			if (recordEquals(currentValues, prev)) return;

			setStatus(StatusIndicator.SAVING);
			try {
				await saveResponse(user.id, userResponse.id, currentValues);
				setStatus(StatusIndicator.SUCCESS);
				prevValues.current = currentValues;
			} catch (err) {
				console.error(err);
				setStatus(StatusIndicator.FAILED);
			}
		};
		autosaveTimer.current = setInterval(autosave, 1000);

		return () => {
			clearInterval(autosaveTimer.current);
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const isPhoneValid = (phone: string) => {
		try {
			const number = phoneUtil.parseAndKeepRawInput(phone, 'US');
			return phoneUtil.isValidNumber(number);
		} catch (error) {
			console.log('not valid phone number');
			return false;
		}
	};

	const validateInputs = (
		responses: Record<string, any>,
		scrollToError: boolean = true
	) => {
		const errors: Record<string, any> = {};
		Object.entries(responses).forEach(([questionKey, response]) => {
			// find associated question
			let question = formSections
				.flatMap((section) => section.questions)
				.find((q) => q.key === questionKey);

			// If no question is found and this is not an MLH form, the response has nothing to be validated against - this case should not happen
			if (!question && !prismaForm.is_mlh) return;

			// If no question is found and this is an MLH form, check the MLH questions
			if (!question && prismaForm.is_mlh) {
				question =
					mlhQuestions.general.questions.find(
						(question: QuestionInterface) => question.key === questionKey
					) ||
					mlhQuestions.agreements.questions.find(
						(question: QuestionInterface) => question.key === questionKey
					);
			}

			if (!question) return; // No question is associated - return
			if (!response && !question.settings.required) {
				return;
			}

			switch (question.type) {
				case QuestionType.email:
					if (isEmpty(response) && question.settings.required) {
						errors[questionKey] = 'Please enter an email';
					}
					if (!isValidEmail(response)) {
						errors[questionKey] = 'Invalid email';
					}
					break;
				case QuestionType.phone:
					if (isEmpty(response) && question.settings.required) {
						errors[questionKey] = 'Please enter a phone number';
					}
					if (!isPhoneValid(response)) {
						errors[questionKey] = 'Invalid phone number';
					}
					break;
				case QuestionType.paragraph:
				case QuestionType.shortResponse:
					if (isEmpty(response) && question.settings.required) {
						errors[questionKey] = 'Please enter a response';
					}
					if (
						response.length >
						(question.settings?.maxChars ?? ShortResponseLength)
					) {
						errors[questionKey] = 'Exceeded maximum character limit';
					}
					break;
				case QuestionType.dropdown:
				case QuestionType.multiplechoice:
					if (
						question.choices &&
						!question.choices.map((choice) => choice.value).includes(response)
					) {
						errors[questionKey] = 'Please select a valid choice';
					}
					break;
				case QuestionType.checkbox:
					if (
						(!Array.isArray(response) || response.length === 0) &&
						question.settings.required
					) {
						errors[questionKey] = 'Please select at least one option';
					}
					break;
				case QuestionType.agreement:
					if (!response && question.settings.required) {
						errors[questionKey] = 'Please agree';
					}
					break;
				case QuestionType.file:
					// Existing error should already exist if file size is too large
					if (questionKey in currResponse.errors)
						errors[questionKey] = currResponse.errors[questionKey];
					else if (isEmpty(response?.value ?? '')) {
						errors[questionKey] = 'Please upload a file';
					}
					break;
			}
		});

		currResponse.setErrors(errors);
		if (scrollToError) {
			// Scroll to first error
			let foundError = false;
			for (const question of mlhQuestions.general.questions) {
				if (question.key in errors) {
					document
						.getElementById(question.key)
						?.scrollIntoView({ behavior: 'smooth' });
					foundError = true;
					break;
				}
			}

			for (const question of formSections.flatMap(
				(section: FormSection) => section.questions
			)) {
				if (foundError) break;
				if (question.key in errors) {
					document
						.getElementById(question.key)
						?.scrollIntoView({ behavior: 'smooth' });
					foundError = true;
					break;
				}
			}

			for (const question of mlhQuestions.agreements.questions) {
				if (foundError) break;
				if (question.key in errors) {
					document
						.getElementById(question.key)
						?.scrollIntoView({ behavior: 'smooth' });
					foundError = true;
					break;
				}
			}
		}

		return Object.keys(errors).length === 0;
	};

	const handleFirstSubmit = () => {
		if (!validateInputs(currResponse.getValues())) return;
		open();
	};

	const handleSubmit = () => {
		if (!validateInputs(currResponse.getValues())) return;
		clearInterval(autosaveTimer.current); // stop timer
		submitResponse(user.id, userResponse.id, currResponse.getValues())
			.then((resp) => {
				console.log(resp);
				setSubmitted(true);
				setStatus(StatusIndicator.SUBMITTED);
				notifications.show({
					color: 'green',
					title: 'Success!',
					message: 'The form was successfully submitted.',
				});
			})
			.catch(() => {
				setStatus(StatusIndicator.FAILED);
				notifications.show({
					color: 'red',
					title: 'Error',
					message: 'There was an error submitting your form.',
				});
			});
	};

	return (
		<div className='my-16 grid grid-cols-[auto_40rem_auto] items-center'>
			<div />

			<section className='grid grid-cols-1 items-center'>
				<div className='mb-8'>
					<div className='flex flex-row'>
						<Title
							order={1}
							styles={{
								root: {
									flexGrow: 2,
								},
							}}
						>
							{prismaForm.title}
						</Title>
						<Status status={status} />
					</div>
					<Text>{prismaForm.description}</Text>
				</div>

				<form
					onSubmit={handleSubmit}
					className='flex flex-col items-center gap-8'
				>
					{/* Confirmatin Modal */}
					<Modal opened={modalOpened} onClose={close} title='Submit Form'>
						<Text style={{ marginBottom: '12px' }}>
							Are you sure you want to submit your application? You will not be
							able to edit it after submission.
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

					{/* Form sections */}
					<div className='flex w-full flex-col gap-8'>
						{prismaForm.is_mlh ? (
							<Section
								section={mlhQuestions.general}
								userResponses={currResponse}
								submitted={submitted}
								competitionCode={prismaForm.competition_code}
								formId={prismaForm.id}
								responseId={userResponse.id}
							/>
						) : null}
						{formSections.map((section: FormSection) => {
							return (
								<Section
									key={section.key}
									section={section}
									userResponses={currResponse}
									submitted={submitted}
									competitionCode={prismaForm.competition_code}
									formId={prismaForm.id}
									responseId={userResponse.id}
								/>
							);
						})}
						{prismaForm.is_mlh ? (
							<Agreements
								section={mlhQuestions.agreements}
								userResponses={currResponse}
								submitted={submitted}
							/>
						) : null}
					</div>

					{/* Submit */}
					<Button
						variant='light'
						color='green'
						onClick={handleFirstSubmit}
						disabled={submitted}
					>
						Submit Form
					</Button>
				</form>
			</section>

			<div />
		</div>
	);
}
