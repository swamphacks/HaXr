import { questionType } from '@/types/questionTypes';

export enum FileType {
	PDF = '.pdf',
}

export interface Settings {
	maxChars?: number;
	acceptedFiles?: FileType[];
	required: boolean;
}

export interface Question {
	title: string;
	description: string;
	type: questionType;
	key: string;
	choices?: string[];
	settings: Settings;
}

export interface Agreement {
	label: string;
	required: boolean;
	key: string;
}

export interface Section {
	key: string;
	title: string;
	description: string;
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
