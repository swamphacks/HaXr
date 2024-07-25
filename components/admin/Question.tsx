import { createContext } from 'react';
import { useForm } from '@mantine/form';
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
	MultiSelect
} from '@mantine/core';
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
// import Choices from '@/components/admin/Choices';
import classes from '@/styles/Input.module.css';
import Droppable from '@/components/dnd/Droppable';
import { rem } from '@mantine/core';

import { CSS } from '@dnd-kit/utilities';
import { useSortable, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import {
	questionType,
	answerChoice,
	SelectionQuestion,
	FileQuestion,
	hasAnswerChoices,
	fileSizes,
} from '@/types/questionTypes';
import { Question as FormQuestion, fileTypes } from '@/types/forms';

function FileCheckBox({
	question,
	label,
	setQuestions,
	acceptedTypes,
	iconSize = 18,
	defaultChecked = false,
}: {
	question: FormQuestion;
	label: string;
	setQuestions: any;
	acceptedTypes: string;
	iconSize?: number;
	defaultChecked?: boolean;
}) {
	const handleChecked = (e: any) => {
		if (question.type !== questionType.file) return;
		const checked = e.currentTarget.checked;
		setQuestions((questions: FormQuestion[]) => {
			const idx = questions.findIndex((q) => q.id === question.id);
			const allowedFileTypes = (question as FileQuestion).allowedFileTypes;
			let newFileTypes = [];
			if (checked) {
				newFileTypes = [...allowedFileTypes, label];
			} else {
				const index = allowedFileTypes.indexOf(label);
				newFileTypes = [
					...allowedFileTypes.slice(0, index),
					...allowedFileTypes.slice(index + 1),
				];
			}

			return questions.map((q) =>
				q.id === question.id ? { ...q, allowedFileTypes: newFileTypes } : q
			);
		});
	};

	return (
		<div className='flex flex-row items-center gap-2'>
			<Checkbox
				label={label}
				defaultChecked={defaultChecked}
				onChange={handleChecked}
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

function hasOtherChoice(question: FormQuestion) {
	return (
		(hasAnswerChoices(question) &&
			(question as SelectionQuestion).answerChoices.some((c) => c.other)) ||
		false
	);
}

function AddChoice({
	question,
	setQuestion,
}: {
	question: FormQuestion;
	setQuestion: (value: FormQuestion) => void;
}) {

	const handleAddChoice = () => { }

	return (
		<div className='flex flex-row gap-2'>
			{/* Add Choice */}
			<button
				onClick={handleAddChoice}
			>
				Add Choice
			</button>
		</div>
	);
}

export const OtherIncludedContext = createContext({
	question: {} as FormQuestion,
	setQuestions: (value: FormQuestion[]) => { },
});

function QuestionSettings({ question, setQuestion }: { question: FormQuestion, setQuestion: (value: FormQuestion) => void }) {
	const handleRequiredChange = (e: any) => {
		setQuestion({ ...question, settings: { ...question.settings, required: e.target.checked } });
	}

	const handleMaxWordsChange = (e: any) => {
		debugger;
		const value = e;
		if (typeof value !== 'number') return;
		setQuestion({ ...question, settings: { ...question.settings, maxChars: value } });
	}

	return (
		<Stack>

			{/* Paragraph and Short Response Settings */}
			{(question.type === questionType.paragraph || question.type === questionType.shortResponse) ? (
				<NumberInput
					label='Maximum Characters'
					defaultValue={question.settings.maxChars ?? 1}
					min={1}
					max={10000}
					onChange={handleMaxWordsChange}
				/>
			) : null}
			{(question.type === questionType.file) ?
				(
					<>
						<MultiSelect label="File Types" placeholder="Pick file types" data={fileTypes} />
						<Select label="Max File Size" data={fileSizes} />
					</>
				) : null}

			<Switch
				label='Required'
				defaultChecked={question.settings.required}
				onChange={handleRequiredChange}
				labelPosition='left'
			/>
		</Stack>
	);
}

function Choices({ question, setQuestion }: { question: FormQuestion, setQuestion: (value: FormQuestion) => void }) {

	const handleAddChoice = () => {
		setQuestion({ ...question, choices: [...question.choices ?? [], ''] });
	}

	const handleChoiceChange = (index: number, value: string) => {
		setQuestion({ ...question, choices: question.choices?.map((choice, i) => i === index ? value : choice) });
	}

	if (question.type === questionType.multiplechoice || question.type === questionType.checkbox || question.type === questionType.dropdown) {
		return (
			<>
				<Title order={3}>Answer Choices</Title>
				{question.choices?.map((choice: string, index: number) => {
					return (
						<div key={index} className='flex flex-row items-center gap-2'>
							<TextInput defaultValue={choice} onChange={(e) => handleChoiceChange(index, e.target.value)} />
						</div>
					)
				})}
				<Button onClick={handleAddChoice}>
					Add Choice
				</Button>
			</>
		)
	}

	return null
	// return (
	// 	{
	// 		 ? (
	// 			question.answerChoices.map((choice: answerChoice, index: number) => (
	// 			))) : null
	// 	}
	// )
}

export default function QuestionEdit({ question, setQuestion }: { question: FormQuestion, setQuestion: (value: FormQuestion) => void }) {

	const handleQuestionTypeChange = (e: any) => {
		if (!e) return;
		const newType = getQuestionType(e);
		setQuestion({ ...question, type: newType });
	}

	return (
		<div className='rounded border border-white'>
			<TextInput label='Question Title' defaultValue={question.title} />
			<TextInput label='Question Description' defaultValue={question.description} />
			<Select label='Question Type' data={Object.values(questionType)} onChange={handleQuestionTypeChange} />
			<Choices question={question} setQuestion={setQuestion} />
			<QuestionSettings question={question} setQuestion={setQuestion} />
		</div>
	);
}

// export default function Question({
// 	question,
// 	setQuestions = () => { },
// 	can_edit = false,
// 	viewing = false,
// }: {
// 	question: FormQuestion;
// 	setQuestions?: (value: any) => void;
// 	can_edit?: boolean;
// 	viewing?: boolean;
// }) {
// 	const getChoicePos = (id: string) => {
// 		if (hasAnswerChoices(question)) {
// 			return (question as SelectionQuestion).answerChoices.findIndex(
// 				(choice: answerChoice) => choice.id === id
// 			);
// 		}
//
// 		console.error(`Question of type ${question.type} does not have answer choices.
// 			Returning position '-1'.`);
// 		return -1;
// 	};
//
// 	const getIndex = (questions: FormQuestion[]) => {
// 		return questions.findIndex((q) => q.id === question.id);
// 	};
// 	const handleDragged = (event: any) => {
// 		const { active, over } = event;
// 		if (active.id === over.id) return;
// 		setQuestions((questions: FormQuestion[]) => {
// 			return questions.map((q) =>
// 				q.id === question.id
// 					? {
// 						...question,
// 						answerChoices: arrayMove(
// 							(question as SelectionQuestion).answerChoices,
// 							getChoicePos(active.id),
// 							getChoicePos(over.id)
// 						),
// 					}
// 					: q
// 			);
// 		});
// 	};
//
// 	const id = question.id;
// 	const { attributes, listeners, setNodeRef, transform, transition } =
// 		useSortable({ id });
//
// 	const style = {
// 		transition,
// 		transform: CSS.Translate.toString(transform),
// 	};
//
// 	const sensors = useSensors(
// 		useSensor(PointerSensor),
// 		useSensor(TouchSensor),
// 		useSensor(KeyboardSensor, {
// 			coordinateGetter: sortableKeyboardCoordinates,
// 		})
// 	);
//
// 	const handleQuestionTypeChange = (e: any) => {
// 		if (!e) return;
// 		const newType = e;
// 		setQuestions((questions: FormQuestion[]) => {
// 			switch (newType) {
// 				case questionType.multiplechoice:
// 				case questionType.checkbox:
// 				case questionType.dropdown:
// 					question = {
// 						...question,
// 						type: newType,
// 						answerChoices: (question as SelectionQuestion)?.answerChoices || [],
// 					};
// 				case questionType.file:
// 					question = {
// 						...question,
// 						type: newType,
// 						allowAllTypes: (question as FileQuestion).allowAllTypes || false,
// 						allowedFileTypes: (question as FileQuestion).allowedFileTypes || [],
// 						maximumFileSize:
// 							(question as FileQuestion).maximumFileSize || fileSizes[0],
// 						maximumFiles: (question as FileQuestion).maximumFiles || 1,
// 					};
// 				default:
// 					question = { ...question, type: newType };
// 			}
// 			return questions.map((q) => (q.id === question.id ? question : q));
// 		});
// 	};
//
// 	return (
// 		<div
// 			className='cursor-default touch-none rounded-md border-2 border-[var(--mantine-color-dark-2)] bg-[var(--mantine-color-body)] p-4 pt-1'
// 			style={{ width: rem(500), ...style }}
// 			key={question.id}
// 			ref={setNodeRef}
// 			{...attributes}
// 		>
// 			{!can_edit ? (
// 				<div className='grid grid-cols-3'>
// 					<div />
// 					<IconGripHorizontal
// 						className='w-5 cursor-pointer justify-self-center'
// 						{...listeners}
// 					/>
// 				</div>
// 			) : null}
//
// 			<Stack>
// 				{/* Question Title */}
// 				<textarea
// 					placeholder='Enter question title'
// 					className={
// 						classes.input + ' box-border h-8 resize-y overflow-y-hidden text-lg'
// 					}
// 					defaultValue={question.title}
// 					onChange={(e) => {
// 						const title = e.currentTarget.value;
// 						setQuestions((questions: FormQuestion[]) => {
// 							return questions.map((q) =>
// 								q.id === question.id ? { ...question, title: title } : q
// 							);
// 						});
// 					}}
// 					disabled={!can_edit}
// 					required
// 				/>
//
// 				{/* Question Type */}
// 				<Select
// 					data={Object.values(questionType)}
// 					value={question.type}
// 					onChange={handleQuestionTypeChange}
// 					disabled={!can_edit}
// 					required
// 				/>
//
// 				{/* Answer Choices */}
// 				{hasAnswerChoices(question) ? (
// 					<>
// 						<AnswerChoiceHeader />
// 						<DndContext
// 							sensors={sensors}
// 							collisionDetection={closestCorners}
// 							onDragEnd={handleDragged}
// 						>
// 							<Droppable id='droppable'>
// 								<Choices
// 									choices={(question as SelectionQuestion).answerChoices}
// 									disabled={!can_edit}
// 									question={question}
// 									setQuestions={setQuestions}
// 								/>
// 							</Droppable>
// 						</DndContext>
// 						{!can_edit ? (
// 							<AddChoice question={question} setQuestions={setQuestions} />
// 						) : null}
// 					</>
// 				) : null}
//
// 				{/* Address Type Question */}
// 				{question.type === questionType.shortResponse ? (
// 					<TextInput placeholder='Enter response' disabled />
// 				) : null}
//
// 				{/* Paragraph Type Question */}
// 				{question.type === questionType.paragraph ? (
// 					<Textarea placeholder='Enter response' disabled />
// 				) : null}
//
// 				{/* Agreement Type Question */}
// 				{question.type === questionType.agreement ? (
// 					<Checkbox label={question.title} disabled />
// 				) : null}
//
// 				{/* Address Type Question */}
// 				{question.type === questionType.address ? (
// 					<Stack>
// 						<TextInput disabled label='Address Line 1' />
// 						<TextInput disabled label='Address Line 2' />
// 						<TextInput disabled label='City' />
// 						<TextInput disabled label='State' />
// 						<TextInput disabled label='Country' />
// 						<TextInput disabled label='Pincode' />
// 					</Stack>
// 				) : null}
//
// 				{/* File Type Question */}
// 				{question.type === questionType.file ? (
// 					<>
// 						<Switch
// 							label='Allow only certain files'
// 							labelPosition='left'
// 							defaultChecked={!(question as FileQuestion).allowAllTypes}
// 							onChange={(e) => {
// 								const checked = e.currentTarget.checked;
// 								setQuestions((questions: FormQuestion[]) => {
// 									(question as FileQuestion).allowAllTypes = !checked;
// 									return questions.map((q) =>
// 										q.id === question.id ? question : q
// 									);
// 								});
// 							}}
// 						/>
// 						{!(question as FileQuestion).allowAllTypes ? (
// 							<div className='grid grid-cols-2 gap-2'>
// 								{fileTypes.map((fileType: FileType, index: number) => (
// 									<FileCheckBox
// 										question={question}
// 										key={index}
// 										label={fileType.type}
// 										setQuestions={setQuestions}
// 										acceptedTypes={fileType.extensions.join(', ')}
// 										defaultChecked={(
// 											question as FileQuestion
// 										).allowedFileTypes?.includes(fileType.type)}
// 									/>
// 								))}
// 							</div>
// 						) : null}
// 						<NumberInput
// 							label='Maximum number of files'
// 							defaultValue={(question as FileQuestion).maximumFiles}
// 							min={1}
// 							max={10}
// 							onChange={(e) =>
// 								typeof e === 'number'
// 									? setQuestions((questions: FormQuestion[]) => {
// 										(question as FileQuestion).maximumFiles = e;
// 										return questions.map((q) =>
// 											q.id === question.id ? question : q
// 										);
// 									})
// 									: null
// 							}
// 						/>
// 						<Select
// 							label='Maximum File Size'
// 							defaultValue={(question as FileQuestion).maximumFileSize}
// 							data={fileSizes}
// 							onChange={(e) =>
// 								e
// 									? setQuestions((questions: FormQuestion[]) => {
// 										(question as FileQuestion).maximumFileSize = e;
// 										return questions.map((q) =>
// 											q.id === question.id ? question : q
// 										);
// 									})
// 									: null
// 							}
// 						/>
// 						<div className='flex flex-row-reverse'>
// 							<button className='flex flex-row gap-2 text-blue-500'>
// 								<IconFolder stroke={1.25} width={24} />
// 								View Folder
// 							</button>
// 						</div>
// 					</>
// 				) : null}
//
// 				{/* Question Settings */}
// 				<Divider />
// 				<div className='col-start-2 flex flex-row-reverse items-center gap-4'>
// 					<Switch
// 						label='Required'
// 						defaultChecked={(question as SelectionQuestion).required}
// 						onChange={(e) =>
// 							setQuestions((questions: FormQuestion[]) =>
// 								questions.map((q) =>
// 									q.id === question.id
// 										? {
// 											...question,
// 											required: e.target.checked,
// 										}
// 										: q
// 								)
// 							)
// 						}
// 						size='xs'
// 						labelPosition='left'
// 						disabled={!can_edit}
// 					/>
// 					<Divider orientation='vertical' />
// 					<Tooltip label='Delete' color='gray'>
// 						<button
// 							className='justify-self-end'
// 							onClick={() =>
// 								setQuestions((questions: FormQuestion[]) =>
// 									questions.filter((q) => q.id !== question.id)
// 								)
// 							}
// 							disabled={!can_edit}
// 						>
// 							<IconTrash className='w-5' stroke={1.25} />
// 						</button>
// 					</Tooltip>
// 					<Tooltip label='Duplicate' color='gray'>
// 						<button
// 							className='justify-self-end'
// 							disabled={!can_edit}
// 							onClick={() => {
// 								setQuestions((questions: FormQuestion[]) => [
// 									...questions,
// 									{ ...question, id: uuidv4() },
// 								]);
// 							}}
// 						>
// 							<IconRubberStamp className='w-5' stroke={1.25} />
// 						</button>
// 					</Tooltip>
// 				</div>
// 			</Stack>
// 		</div>
// 	);
// }
