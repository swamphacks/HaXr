export enum QuestionType {
  paragraph = 'Paragraph',
  shortResponse = 'Short Answer',
  file = 'File Upload',
  checkbox = 'Checkbox',
  multiplechoice = 'Multiple Choice',
  dropdown = 'Dropdown',
  agreement = 'Agreement',
  phone = 'Phone',
  email = 'Email',
}

export type FileType = {
  type: string;
  extensions: string[];
};

export interface BaseQuestion {
  title: string;
  type: QuestionType;
  id: string;
  required: boolean;
  mlh?: boolean;
}

export interface SelectionQuestion extends BaseQuestion {
  answerChoices: answerChoice[];
}

export type FormQuestion = SelectionQuestion | BaseQuestion;

export type answerChoice = {
  value: string;
  id: string;
  other?: boolean;
};
