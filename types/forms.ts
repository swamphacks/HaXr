import { questionType } from '@/types/questionTypes';

export enum StatusIndicator {
  SUCCESS = 'Success',
  FAILED = 'Failed',
  LOADING = 'Loading',
  SUBMITTED = 'Submitted',
}

export enum FileType {
  PDF = 'PDF',
  IMG = 'Image',
  VIDEO = 'Video',
}
export const fileTypes: FileType[] = [
  FileType.PDF,
  FileType.IMG,
  FileType.VIDEO,
];

export const fileSizes = ['1MB', '10MB', '100MB', '1GB'];

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
  type: questionType;
  key: string;
  choices?: string[];
  settings: QuestionSettings;
}

export interface Agreement {
  label: string;
  required: boolean;
  key: string;
}

export interface FormSection {
  key: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface MLHApplication {
  general: FormSection;
  agreements: FormSection;
}

export interface Application {
  general: FormSection;
  agreements: Agreement[];
  sections: Record<string, FormSection>;
}

export interface Response {
  key: string;
  value: string | number | boolean;
}

export interface SectionResponse {
  key: string;
  responses: Response[];
}

export interface ApplicationResponse {
  general: Response[];
  agreements: Response[];
  sections: Record<string, Response[]>;
}
