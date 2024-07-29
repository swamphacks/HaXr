import { createContext } from 'react';
import {
	Stack,
	Select,
	Switch,
	Divider,
	Tooltip,
	Checkbox,
	NumberInput,
	Textarea,
	TextInput,
	Title,
	Button,
	MultiSelect,
} from '@mantine/core';
import { questionType } from '@/types/questionTypes';
import { Question as FormQuestion, fileTypes, fileSizes } from '@/types/forms';

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
		case 'File Upload':
			return questionType.file;
		case 'Agreement':
			return questionType.agreement;
		case 'Phone':
			return questionType.phone;
		case 'Email':
			return questionType.email;
		default:
			console.error(
				`Invalid question type '{value}'. Defaulting to 'Paragraph'`
			);
			return questionType.paragraph;
	}
}

export const OtherIncludedContext = createContext({
	question: {} as FormQuestion,
	setQuestions: (value: FormQuestion[]) => { },
});

function QuestionSettings({
	question,
	setQuestion,
	disabled
}: {
	question: FormQuestion;
	setQuestion: (value: FormQuestion) => void;
	disabled: boolean;
}) {
	const handleRequiredChange = (e: any) => {
		setQuestion({
			...question,
			settings: { ...question.settings, required: e.target.checked },
		});
	};

	const handleMaxWordsChange = (e: any) => {
		const value = e;
		if (typeof value !== 'number') return;
		setQuestion({
			...question,
			settings: { ...question.settings, maxChars: value },
		});
	};

	const handleAcceptedFilesChange = (files: string[]) => {
		// TODO: Add file type validation
		setQuestion({
			...question,
			settings: { ...question.settings, acceptedFiles: files as any },
		});
	};

	const handleMaxFileSizeChange = (e: any) => {
		setQuestion({
			...question,
			settings: { ...question.settings, maxFileSize: e },
		});
	};

	return (
		<Stack>
			{/* Paragraph and Short Response Settings */}
			{question.type === questionType.paragraph ||
				question.type === questionType.shortResponse ? (
				<NumberInput
					label='Maximum Characters'
					defaultValue={question.settings.maxChars ?? 1}
					min={1}
					max={10000}
					disabled={disabled}
					onChange={handleMaxWordsChange}
				/>
			) : null}

			{/* File Type Setting */}
			{question.type === questionType.file ? (
				<>
					<MultiSelect
						label='File Types'
						placeholder='Pick file types'
						data={fileTypes}
						defaultValue={question.settings.acceptedFiles}
						onChange={handleAcceptedFilesChange}
						disabled={disabled}
						clearable
					/>
					<Select
						label='Max File Size'
						data={fileSizes}
						defaultValue={question.settings.maxFileSize}
						disabled={disabled}
						onChange={handleMaxFileSizeChange}
					/>
				</>
			) : null}

			<Switch
				label='Required'
				defaultChecked={question.settings.required}
				onChange={handleRequiredChange}
				disabled={disabled}
				labelPosition='left'
			/>
		</Stack>
	);
}

function Choices({
	question,
	setQuestion,
	disabled,
}: {
	question: FormQuestion;
	setQuestion: (value: FormQuestion) => void;
	disabled: boolean;
}) {
	const handleAddChoice = () => {
		setQuestion({ ...question, choices: [...(question.choices ?? []), ''] });
	};

	const handleChoiceChange = (index: number, value: string) => {
		setQuestion({
			...question,
			choices: question.choices?.map((choice, i) =>
				i === index ? value : choice
			),
		});
	};

	if (
		question.type === questionType.multiplechoice ||
		question.type === questionType.checkbox ||
		question.type === questionType.dropdown
	) {
		return (
			<Stack align='left'>
				<Divider my='md' label='Choices' />
				{question.choices?.map((choice: string, index: number) => {
					return (
						<TextInput
							key={index}
							defaultValue={choice}
							onChange={(e) => handleChoiceChange(index, e.target.value)}
							disabled={disabled}
						/>
					);
				})}
				<Button variant='light' onClick={handleAddChoice} disabled={disabled}>
					Add Choice
				</Button>
			</Stack>
		);
	}

	return null;
}

export default function QuestionEdit({
	question,
	setQuestion,
	disabled = false,
}: {
	question: FormQuestion;
	setQuestion: (value: FormQuestion) => void;
	disabled: boolean;
}) {
	const handleTitleChange = (e: any) => {
		setQuestion({ ...question, title: e.target.value });
	};

	const handleDescriptionChange = (e: any) => {
		setQuestion({ ...question, description: e.target.value });
	};

	const handleQuestionTypeChange = (e: any) => {
		if (!e) return;
		const newType = getQuestionType(e);
		setQuestion({ ...question, type: newType });
	};

	return (
		<div className='w-[48rem] rounded border border-[var(--mantine-color-dark-4)] p-4'>
			<TextInput
				label='Title'
				placeholder='Enter title'
				onChange={handleTitleChange}
				defaultValue={question.title}
				disabled={disabled}
			/>
			<TextInput
				label='Description'
				placeholder='Enter description'
				onChange={handleDescriptionChange}
				defaultValue={question.description}
				disabled={disabled}
			/>
			<Select
				label='Type'
				data={Object.values(questionType)}
				defaultValue={question.type}
				onChange={handleQuestionTypeChange}
				disabled={disabled}
			/>
			<Choices disabled={disabled} question={question} setQuestion={setQuestion} />
			<Divider my='md' label='Settings' />
			<QuestionSettings disabled={disabled} question={question} setQuestion={setQuestion} />
		</div>
	);
}
