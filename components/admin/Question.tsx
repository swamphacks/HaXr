import { useState, useRef } from 'react';
import { createContext } from 'react';
import {
	Button,
	Stack,
	Select,
	Switch,
	Divider,
	Tooltip,
	Checkbox,
	NumberInput,
	Textarea,
	TextInput,
	Group,
} from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
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
import Choices from '@/components/admin/Choices';
import classes from '@/styles/Input.module.css';
import Droppable from '@/components/dnd/Droppable';
import { rem } from '@mantine/core';

import { CSS } from '@dnd-kit/utilities';
import { useSortable, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import {
	FormQuestion,
	questionType,
	answerChoice,
	SelectionQuestion,
	fileTypes,
	FileType,
	FileQuestion,
	hasAnswerChoices,
	fileSizes,
} from '@/types/questionTypes';

function FileCheckBox({
	question,
	label,
	setQuestion,
	acceptedTypes,
	iconSize = 18,
	defaultChecked = false,
}: {
	question: FormQuestion;
	label: string;
	setQuestion: any;
	acceptedTypes: string;
	iconSize?: number;
	defaultChecked?: boolean;
}) {

	const handleChecked = (e: any) => {
		if (question.type !== questionType.file) return;
		const checked = e.currentTarget.checked;
		setQuestion((question: FormQuestion) => {
			const allowedFileTypes = (question as FileQuestion).allowedFileTypes;
			let newFileTypes = []
			if (checked) {
				newFileTypes = [...allowedFileTypes, label];
			} else {
				const index = allowedFileTypes.indexOf(label);
				newFileTypes = [...allowedFileTypes.slice(0, index), ...allowedFileTypes.slice(index + 1)];
			}
			return {
				...question,
				allowedFileTypes: newFileTypes,
			};
		});
	}

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
		case 'Address':
			return questionType.address;
		case 'File Upload':
			return questionType.file;
		default:
			console.error(
				`Invalid question type '{value}'. Defaulting to 'Paragraph'`
			);
			return questionType.paragraph;
	}
}

function hasOtherChoice(question: FormQuestion) {
	return (hasAnswerChoices(question) && (question as SelectionQuestion).answerChoices.some((c) => c.other)) || false;
}

function AddChoice({ question, setQuestion }: any) {
	return (
		<div className='flex flex-row gap-2'>
			{/* Add Choice */}
			<button
				onClick={() => {
					setQuestion((question: FormQuestion) => {
						const length = (question as SelectionQuestion).answerChoices.length;
						return hasOtherChoice(question) ? {
							...question,
							answerChoices: [
								...(question as SelectionQuestion).answerChoices.slice(0, -1),
								{ value: '', id: uuidv4() },
								(question as SelectionQuestion).answerChoices[length - 1],
							]
						} : {
							...question,
							answerChoices: [
								...(question as SelectionQuestion).answerChoices,
								{ value: '', id: uuidv4() },
							]
						}
					});
				}}
			>
				Add Choice
			</button>

			{/* Add Other */}
			{!hasOtherChoice(question) ? (
				<>
					<p> or </p>
					<button
						onClick={() => {
							setQuestion((question: FormQuestion) => {
								return {
									...question,
									answerChoices: [
										...(question as SelectionQuestion).answerChoices,
										{ value: '', id: uuidv4(), other: true }
									]
								};
							})
						}}
						className='text-blue-500'
					>
						add &quot;Other&quot;
					</button>
				</>
			) : null}
		</div>
	);
}

export const OtherIncludedContext = createContext({
	setQuestion: (value: FormQuestion) => { },
});

export default function Question({
	question,
	setQuestions = (value: any) => { },
	disabled = false,
}: {
	question: FormQuestion;
	setQuestions?: (value: any) => void;
	disabled?: boolean;
}) {
	const [currQuestion, setQuestion] = useState<FormQuestion>(question);
	// const [selectedQuestionType, setQuestionType] = useState<string>(
	// 	question.type
	// );
	// const [choices, setChoices] = useState<answerChoice[]>(
	// 	hasAnswerChoices(question)
	// 		? (question as SelectionQuestion).answerChoices
	// 		: []
	// );
	// const [required, setRequired] = useState<boolean>(question.required);
	// const [title, setTitle] = useState<string>(question.title);
	// const [otherIncluded, setOther] = useState<boolean>(
	// 	(hasAnswerChoices(question) &&
	// 		(question as SelectionQuestion).answerChoices?.some((c) => c.other)) ||
	// 	false
	// );
	// const [allowCertainFiles, setAllowCertainFiles] = useState<boolean>(
	// 	question.type === questionType.file
	// 		? !(question as FileQuestion).allowAllTypes
	// 		: false
	// );
	// const [allowedFileTypes, setAllowedFileTypes] = useState<string[]>(
	// 	question.type === questionType.file
	// 		? (question as FileQuestion).allowedFileTypes || []
	// 		: []
	// );

	const getChoicePos = (id: string) => {
		if (hasAnswerChoices(currQuestion)) {
			return (currQuestion as SelectionQuestion)
				.answerChoices.findIndex((choice: answerChoice) => choice.id === id);
		}

		console.error(`Question of type ${currQuestion.type} does not have answer choices.
			Returning position '-1'.`);
		return -1;
	}
	const handleDragged = (event: any) => {
		const { active, over } = event;
		if (active.id === over.id) return;
		setQuestion((question: FormQuestion) => {
			return {
				...question,
				answerChoices: arrayMove(
					(question as SelectionQuestion).answerChoices,
					getChoicePos(active.id),
					getChoicePos(over.id)
				)
			}
		});
	};

	const id = question.id;
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id });

	const style = {
		transition,
		transform: CSS.Translate.toString(transform),
	};

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(TouchSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);
	const openRef = useRef<() => void>(null);
	// const maxFileSize = useRef<string>(
	// 	question.type === questionType.file
	// 		? (question as FileQuestion).maximumFileSize
	// 		: fileSizes[0]
	// );
	// const maxFiles = useRef<number>(
	// 	question.type === questionType.file
	// 		? (question as FileQuestion).maximumFiles
	// 		: 1
	// );

	const handleQuestionTypeChange = (e: any) => {
		if (!e) return;
		setQuestion((question: FormQuestion) => {
			switch (e) {
				case questionType.multiplechoice:
				case questionType.checkbox:
				case questionType.dropdown:
					return {
						...question,
						type: e,
						answerChoices: (question as SelectionQuestion).answerChoices || [],
					};
				case questionType.file:
					return {
						...question,
						type: e,
						allowAllTypes: (question as FileQuestion).allowAllTypes || false,
						allowedFileTypes: (question as FileQuestion).allowedFileTypes || [],
						maximumFileSize: (question as FileQuestion).maximumFileSize || fileSizes[0],
						maximumFiles: (question as FileQuestion).maximumFiles || 1,
					}
				default:
					return { ...question, type: e };
			}
			return { ...question, type: getQuestionType(e) };
		});
	}


	return (
		<div
			className='cursor-default touch-none rounded-md border-2 border-[var(--mantine-color-dark-2)] bg-[var(--mantine-color-body)] p-4 pt-1'
			style={{ width: rem(500), ...style }}
			key={question.id}
			ref={setNodeRef}
			{...attributes}
		>
			{!disabled ? (
				<div className='grid grid-cols-3'>
					<div />
					<IconGripHorizontal
						className='w-5 cursor-pointer justify-self-center'
						{...listeners}
					/>
				</div>
			) : null}

			<Stack>
				{/* Question Title */}
				<textarea
					placeholder='Enter question title'
					className={
						classes.input + ' box-border h-8 resize-y overflow-y-hidden text-lg'
					}
					defaultValue={currQuestion.title}
					onChange={(e) => {
						const title = e.currentTarget.value;
						setQuestion((question: FormQuestion) => {
							return { ...question, title: title };
						})
					}}
					disabled={disabled}
					required
				/>

				{/* Question Type */}
				<Select
					data={Object.values(questionType)}
					value={currQuestion.type}
					onChange={handleQuestionTypeChange}
					disabled={disabled}
					required
				/>

				{/* Answer Choices */}
				{hasAnswerChoices(currQuestion) ? (
					<OtherIncludedContext.Provider value={{ setQuestion }}>
						<AnswerChoiceHeader />
						<DndContext
							sensors={sensors}
							collisionDetection={closestCorners}
							onDragEnd={handleDragged}
						>
							<Droppable id='droppable'>
								<Choices
									choices={(currQuestion as SelectionQuestion).answerChoices}
									disabled={disabled}
									questionType={currQuestion.type}
								/>
							</Droppable>
						</DndContext>
						{!disabled ? (
							<AddChoice
								question={currQuestion}
								setQuestion={setQuestion}
							/>
						) : null}
					</OtherIncludedContext.Provider>
				) : null}

				{/* Address Type Question */}
				{currQuestion.type === questionType.shortResponse ? (
					<TextInput placeholder='Enter response' disabled />
				) : null}

				{/* Paragraph Type Question */}
				{currQuestion.type === questionType.paragraph ? (
					<Textarea placeholder='Enter response' disabled />
				) : null}

				{/* Agreement Type Question */}
				{currQuestion.type === questionType.agreement ? (
					<Checkbox label={currQuestion.title} disabled />
				) : null}

				{/* Address Type Question */}
				{currQuestion.type === questionType.address ? (
					<Stack>
						<TextInput disabled label='Address Line 1' />
						<TextInput disabled label='Address Line 2' />
						<TextInput disabled label='City' />
						<TextInput disabled label='State' />
						<TextInput disabled label='Country' />
						<TextInput disabled label='Pincode' />
					</Stack>
				) : null}

				{/* File Type Question */}
				{currQuestion.type === questionType.file ? (
					<>
						<Switch
							label='Allow only certain files'
							labelPosition='left'
							defaultChecked={!(currQuestion as FileQuestion).allowAllTypes}
							onChange={(e) => {
								setQuestion((question: FormQuestion) => {
									const newQuestion = { ...question } as FileQuestion;
									newQuestion.allowAllTypes = !e.currentTarget.checked;
									return newQuestion;
								});
							}}
						/>
						{!(currQuestion as FileQuestion).allowAllTypes ? (
							<div className='grid grid-cols-2 gap-2'>
								{fileTypes.map((fileType: FileType, index: number) => (
									<FileCheckBox
										question={currQuestion}
										key={index}
										label={fileType.type}
										setQuestion={setQuestion}
										acceptedTypes={fileType.extensions.join(', ')}
										defaultChecked={(currQuestion as FileQuestion).
											allowedFileTypes?.includes(fileType.type)}
									/>
								))}
							</div>
						) : null}
						<NumberInput
							label='Maximum number of files'
							defaultValue={(currQuestion as FileQuestion).maximumFiles}
							min={1}
							max={10}
							onChange={(e) =>
								typeof e === 'number' ?
									setQuestion((question: FormQuestion) => {
										const newQuestion = { ...question };
										(newQuestion as FileQuestion).maximumFiles = e;
										return newQuestion;
									})
									: null
							}
						/>
						<Select
							label='Maximum File Size'
							defaultValue={(currQuestion as FileQuestion).maximumFileSize}
							data={fileSizes}
							onChange={(e) => e ?
								setQuestion((question: FormQuestion) => {
									const newQuestion = { ...question };
									(newQuestion as FileQuestion).maximumFileSize = e;
									return newQuestion;
								})
								: null}
						/>
						<div className='flex flex-row-reverse'>
							<button className='flex flex-row gap-2 text-blue-500'>
								<IconFolder stroke={1.25} width={24} />
								View Folder
							</button>
						</div>
						<Dropzone openRef={openRef} onDrop={() => { }} />

						<Group justify='center' mt='md'>
							<Button onClick={() => openRef.current?.()}>Select files</Button>
						</Group>
					</>
				) : null}

				{/* Question Settings */}
				<Divider />
				<div className='col-start-2 flex flex-row-reverse items-center gap-4'>
					<Switch
						label='Required'
						defaultChecked={(currQuestion as SelectionQuestion).required}
						onChange={() =>
							setQuestion((question: FormQuestion) => {
								return { ...question, required: !question.required };
							})}
						size='xs'
						labelPosition='left'
						disabled={disabled}
					/>
					<Divider orientation='vertical' />
					<Tooltip label='Delete' color='gray'>
						<button
							className='justify-self-end'
							onClick={() =>
								setQuestions((oldQuestions: FormQuestion[]) => {
									return oldQuestions.filter((q) => q.id !== question.id)
								})
							}
							disabled={disabled}
						>
							<IconTrash className='w-5' stroke={1.25} />
						</button>
					</Tooltip>
					<Tooltip label='Duplicate' color='gray'>
						<button
							className='justify-self-end'
							disabled={disabled}
							onClick={() => {
								switch (currQuestion.type) {
									case questionType.multiplechoice:
									case questionType.checkbox:
									case questionType.dropdown:
										setQuestions((oldQuestions: FormQuestion[]) => [
											...oldQuestions,
											{
												title: currQuestion.title,
												type: currQuestion.type,
												answerChoices: (currQuestion as SelectionQuestion).answerChoices,
												required: currQuestion.required,
												id: uuidv4(),
											},
										]);
										break;
									case questionType.file:
										setQuestions((oldQuestions: FormQuestion[]) => [
											...oldQuestions,
											{
												title: currQuestion.title,
												type: currQuestion.type,
												allowedFileTypes: (currQuestion as FileQuestion).allowedFileTypes,
												allowAllTypes: (currQuestion as FileQuestion).allowAllTypes,
												maximumFileSize: (currQuestion as FileQuestion).maximumFileSize,
												maximumFiles: (currQuestion as FileQuestion).maximumFiles,
												required: currQuestion.required,
												id: uuidv4(),
											},
										]);
										break;
									default:
										setQuestions((oldQuestions: FormQuestion[]) => [
											...oldQuestions,
											{
												title: currQuestion.title,
												type: currQuestion.type,
												required: currQuestion.required,
												id: uuidv4(),
											},
										]);
								}
							}}
						>
							<IconRubberStamp className='w-5' stroke={1.25} />
						</button>
					</Tooltip>
				</div>
			</Stack>
		</div>
	);
}
