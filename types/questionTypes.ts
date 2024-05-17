export enum questionType {
  paragraph = 'Paragraph',
  shortResponse = 'Short Answer',
  file = 'File Upload',
  address = 'Address',
  checkbox = 'Checkbox',
  multiplechoice = 'Multiple Choice',
  dropdown = 'Dropdown',
  agreement = 'Agreement',
}

export type FileType = {
  type: string;
  extensions: string[];
};

export const fileTypes: FileType[] = [
  { type: 'Document', extensions: ['.DOC', '.DOCX', '.TXT'] },
  { type: 'Spreadsheet', extensions: ['.XLS', '.XLSX', '.CSV'] },
  { type: 'PDF', extensions: ['.PDF'] },
  {
    type: 'Video',
    extensions: [
      '.WebM',
      '.MPEG4',
      '.3GPP',
      '.MOV',
      '.AVI',
      '.MPEGPS',
      '.WMV',
      '.FLV',
      '.ogg',
    ],
  },
  { type: 'Presentation', extensions: ['.PPT', '.PPTX'] },
  { type: 'Drawing', extensions: ['.AI', '.PSD'] },
  {
    type: 'Image',
    extensions: ['.JPEG', '.PNG', '.GIF', '.BMP', '.TIFF', '.SVG'],
  },
  { type: 'Audio', extensions: ['.MP3', '.WAV', '.MPEG', '.ogg', '.opus'] },
];

export const fileSizes = ['1MB', '10MB', '100MB'];

export interface BaseQuestion {
  title: string;
  type: questionType;
  id: string;
  required: boolean;
  mlh?: boolean;
}

export interface SelectionQuestion extends BaseQuestion {
  answerChoices: answerChoice[];
}

export interface Agreement extends BaseQuestion {
  mustAgree: boolean;
}

export interface FileQuestion extends BaseQuestion {
  allowAllTypes: boolean;
  maximumFileSize: string;
  maximumFiles: number;
  allowedFileTypes: string[];
}

export interface AddressQuestion extends BaseQuestion {
  addressLineOne: string;
  addressLineTwo?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export type FormQuestion =
  | SelectionQuestion
  | Agreement
  | FileQuestion
  | AddressQuestion
  | BaseQuestion;

export type answerChoice = {
  value: string;
  id: string;
  other?: boolean;
};

export function hasAnswerChoices(question: FormQuestion): boolean {
  return [
    questionType.multiplechoice,
    questionType.dropdown,
    questionType.checkbox,
  ].includes(question.type);
}
