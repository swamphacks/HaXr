import { questionType } from '@/types/questionTypes';

export interface Question {
  title: string;
  type: questionType;
  required: boolean;
  key: string;
  choices?: string[];
}

export interface Agreement {
  label: string;
  required: boolean;
  key: string;
}

export interface Section {
  title: string;
  questions: Question[];
}

export interface Application {
  general: Section;
  agreements: Agreement[];
  sections: Record<string, Section>;
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
