import { questionType } from '@/types/questionTypes';

export enum StatusIndicator {
  SUCCESS = 'Success',
  FAILED = 'Failed',
  LOADING = 'Loading',
  SUBMITTED = 'Submitted',
  SAVING = 'Saving',
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

export const fileSizes = ['1KB', '1MB', '10MB', '100MB', '1GB'];

export const ShortResponseLength = 100;
export const MaxParagraphLength = 10000;

export interface QuestionSettings {
  maxChars?: number;
  acceptedFiles?: FileType[];
  maxFileSize?: string;
  required: boolean;
}

export interface Choice {
  key: string;
  value: string;
}

export interface Question {
  title: string;
  description?: string;
  placeholder?: string;
  type: questionType;
  key: string;
  choices?: Choice[];
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
  url?: string;
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

export interface FormSettings {
  is_mlh: boolean;
  is_published: boolean;
  required: boolean;
  opens_at: Date | null;
  closes_at: Date | null;
}

export interface FileResponse {
  url: string;
  value: string;
}
