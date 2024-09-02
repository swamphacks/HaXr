import { FileType } from '@/types/forms';

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

export interface Choice {
  key: string;
  value: string;
}

export interface QuestionSettings {
  maxChars?: number;
  acceptedFiles?: FileType[];
  maxFileSize?: string;
  required: boolean;
}

export interface Question {
  title: string;
  description?: string;
  placeholder?: string;
  type: QuestionType;
  key: string;
  choices?: Choice[];
  settings: QuestionSettings;
  mlh?: boolean;
}

export interface MLHQuestion extends Question {
  mlh: boolean;
}

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
