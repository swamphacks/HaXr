import { CloseButton, Radio, Checkbox } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';

import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

import classes from '@/styles/Input.module.css';

import { FormQuestion, SelectionQuestion, answerChoice, questionType } from '@/types/questionTypes';

function ChoiceInput({
	choice,
	question,
	setQuestions,
	disabled,
}: {
	choice: answerChoice;
	question: FormQuestion;
	setQuestions: any;
	disabled: boolean;
}) {
	const id = choice.id;
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id });

	const style = {
		transition,
		transform: CSS.Translate.toString(transform),
	};

	const handleTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		choice.value = e.target.value;
		setQuestions((questions: FormQuestion[]) => {
			const choices: answerChoice[] = (question as SelectionQuestion)
				.answerChoices;
			return questions.map((q: FormQuestion) => q.id === question.id ? {
				...question,
				answerChoices: choices.map((c: answerChoice) => c.id === choice.id ? choice : c),
			} : q);
		});
	};

	const handleDeletion = () => {
		setQuestions((questions: FormQuestion[]) =>
			questions.map((q: FormQuestion) => q.id === question.id ? {
				...question,
				answerChoices: (question as SelectionQuestion)
					.answerChoices.filter((c: answerChoice) => c.id !== choice.id),
			} : q)
		);
	};

	return (
		<div
			key={choice.id}
			ref={setNodeRef}
			{...attributes}
			style={style}
			className='grid touch-none grid-cols-[1.3rem_auto_1.3rem] items-center'
		>
			{!disabled ? (
				<IconGripVertical {...listeners} className='w-[1.2rem]' />
			) : null}

			{/* Text Input */}
			<div className='col-start-2 flex flex-row items-center'>
				{question.type === questionType.multiplechoice ? (
					<Radio disabled className='mr-2' />
				) : null}
				{question.type === questionType.checkbox ? (
					<Checkbox disabled className='mr-2' />
				) : null}
				<input
					type='text'
					defaultValue={choice.value}
					onChange={handleTextInput}
					className={classes.input}
					disabled={disabled}
				/>
			</div>

			{/* Delete Button */}
			{!disabled ? <CloseButton onClick={handleDeletion} /> : null}
		</div>
	);
}

export default function Choice({
	choice,
	question,
	setQuestions,
	disabled = false,
}: {
	choice: answerChoice;
	question: FormQuestion;
	setQuestions: any;
	disabled?: boolean;
}) {
	const deleteOther = () => {
		setQuestions((questions: FormQuestion[]) =>
			questions.map((q: FormQuestion) => {
				q.id === question.id ? {
					...question,
					answerChoices: (question as SelectionQuestion).answerChoices.filter(
						(c: answerChoice) => c.id !== choice.id
					),
				} : q
			}))
	};

	return (
		<>
			{!choice.other ? (
				<ChoiceInput
					choice={choice}
					question={question}
					setQuestions={setQuestions}
					disabled={disabled}
				/>
			) : null}
			{choice.other ? (
				<div className='grid grid-cols-[1.3rem_auto_1.3rem] items-center'>
					<div />
					<div className='flex flex-row'>
						{question.type === questionType.multiplechoice ? (
							<Radio disabled className='mr-2' />
						) : null}
						{question.type === questionType.checkbox ? (
							<Checkbox disabled className='mr-2' />
						) : null}
						<p className={classes.input + ' col-start-2'}>Other...</p>
					</div>
					<CloseButton onClick={deleteOther} />
				</div>
			) : null}
		</>
	);
}
