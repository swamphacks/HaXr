import { v4 as uuidv4 } from 'uuid';

export enum questionType {
  paragraph = 'Paragraph',
  shortResponse = 'Short Answer',
  file = 'File Upload',
  address = 'Address',
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

export type Settings = {
  includeMlh: boolean;
};

export const defaultSettings: Settings = {
  includeMlh: true,
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

export interface SelectionResponse extends SelectionQuestion {
  response: answerChoice;
}

export interface Agreement extends BaseQuestion {}

export interface AgreementResponse extends Agreement {
  agreed: boolean;
}

export interface FileQuestion extends BaseQuestion {
  allowAllTypes: boolean;
  maximumFileSize: string;
  maximumFiles: number;
  allowedFileTypes: string[];
}

// TODO: Add response type
export interface FileResponse extends FileQuestion {}

export interface AddressQuestion extends BaseQuestion {
  addressLineOne: string;
  addressLineTwo?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface AddressResponse extends AddressQuestion {}

export type FormQuestion =
  | SelectionQuestion
  | Agreement
  | FileQuestion
  | AddressQuestion
  | BaseQuestion;

export type FormResponse =
  | SelectionResponse
  | AgreementResponse
  | FileResponse
  | AddressResponse
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

export const ageChoices: string[] = [
  'Under 18',
  '18-24',
  '25-34',
  '35-44',
  '45-54',
  '55-64',
  '65+',
];

export const schools: string[] = [
  'University of Florida',
  'University of South Florida',
  'Florida State University',
  'University of Central Florida',
  'Florida International University',
  'Florida Atlantic University',
  'University of Miami',
  'Florida Gulf Coast University',
  'Florida A&M University',
  'Stetson University',
  'Embry-Riddle Aeronautical University',
  'Rollins College',
  'Florida Institute of Technology',
  'Other',
];

export const levelOfStudies: string[] = [
  'Less than Secondary / High School',
  'Secondary / High School',
  'Undergraduate University (2 year - community college or similar)',
  'Undergraduate University (3+ year)',
  'Graduate University (Masters, Professional, Doctoral, etc)',
  'Code School / Bottcamp',
  'Other Vocational / Trade Program or Apprenticeship',
  'Post Doctorate',
  'Other',
  "I'm not currently a student",
  'Prefer not to answer',
];

export const countries: string[] = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'India',
  'Netherlands',
  'Spain',
  'Italy',
  'Brazil',
  'China',
  'Japan',
  'South Korea',
  'Sweden',
  'Russia',
  'Switzerland',
  'Other',
];

export const applicationQuestions: FormQuestion[] = [
  /* MLH Questions */
  {
    title: 'First Name',
    type: questionType.shortResponse,
    mlh: true,
    required: true,
    id: '1',
  },
  {
    title: 'Last Name',
    type: questionType.shortResponse,
    mlh: true,
    required: true,
    id: '2',
  },
  {
    title: 'Age',
    type: questionType.dropdown,
    required: true,
    answerChoices: [
      { value: 'Under 18', id: uuidv4() },
      { value: '18-24', id: uuidv4() },
      { value: '25-34', id: uuidv4() },
      { value: '35-44', id: uuidv4() },
      { value: '45-54', id: uuidv4() },
      { value: '55-64', id: uuidv4() },
      { value: '65+', id: uuidv4() },
    ],
    mlh: true,
    id: '3',
  },
  {
    title: 'Phone Number',
    type: questionType.shortResponse,
    mlh: true,
    required: true,
    id: '4',
  },
  {
    title: 'Email',
    type: questionType.shortResponse,
    mlh: true,
    id: '5',
    required: true,
  },
  {
    title: 'School',
    type: questionType.dropdown,
    mlh: true,
    required: true,
    answerChoices: [
      { value: 'University of Florida', id: uuidv4() },
      { value: 'University of South Florida', id: uuidv4() },
      { value: 'Florida State University', id: uuidv4() },
      { value: 'University of Central Florida', id: uuidv4() },
      { value: 'Florida International University', id: uuidv4() },
      { value: 'Florida Atlantic University', id: uuidv4() },
      { value: 'University of Miami', id: uuidv4() },
      { value: 'Florida Gulf Coast University', id: uuidv4() },
      { value: 'Florida A&M University', id: uuidv4() },
      { value: 'Stetson University', id: uuidv4() },
      { value: 'Embry-Riddle Aeronautical University', id: uuidv4() },
      { value: 'Rollins College', id: uuidv4() },
      { value: 'Florida Institute of Technology', id: uuidv4() },
      { value: 'Other', id: uuidv4() },
    ],
    id: '6',
  },
  {
    title: 'Level of Study',
    type: questionType.multiplechoice,
    mlh: true,
    required: true,
    answerChoices: [
      { value: 'Less than Secondary / High School', id: uuidv4() },
      { value: 'Secondary / High School', id: uuidv4() },
      {
        value:
          'Undergraduate University (2 year - community college or similar)',
        id: uuidv4(),
      },
      { value: 'Undergraduate University (3+ year)', id: uuidv4() },
      {
        value: 'Graduate University (Masters, Professional, Doctoral, etc)',
        id: uuidv4(),
      },
      { value: 'Code School / Bottcamp', id: uuidv4() },
      {
        value: 'Other Vocational / Trade Program or Apprenticeship',
        id: uuidv4(),
      },
      { value: 'Post Doctorate', id: uuidv4() },
      { value: 'Other', id: uuidv4() },
      { value: "I'm not currently a student", id: uuidv4() },
      { value: 'Prefer not to answer', id: uuidv4() },
    ],
    id: '7',
  },
  {
    title: 'Country of Residence',
    type: questionType.dropdown,
    mlh: true,
    required: true,
    answerChoices: [
      { value: 'United States', id: uuidv4() },
      { value: 'Canada', id: uuidv4() },
      { value: 'United Kingdom', id: uuidv4() },
      { value: 'Australia', id: uuidv4() },
      { value: 'Germany', id: uuidv4() },
      { value: 'France', id: uuidv4() },
      { value: 'India', id: uuidv4() },
      { value: 'Netherlands', id: uuidv4() },
      { value: 'Spain', id: uuidv4() },
      { value: 'Italy', id: uuidv4() },
      { value: 'Brazil', id: uuidv4() },
      { value: 'China', id: uuidv4() },
      { value: 'Japan', id: uuidv4() },
      { value: 'South Korea', id: uuidv4() },
      { value: 'Sweden', id: uuidv4() },
      { value: 'Russia', id: uuidv4() },
      { value: 'Switzerland', id: uuidv4() },
      { value: 'Other', id: uuidv4() },
    ],
    id: '8',
  },
  {
    title:
      'I have read and agree to the MLH Code of Conduct. (https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md)',
    type: questionType.agreement,
    mlh: true,
    required: true,
    id: '9',
  },
  {
    title:
      'I authorize you to share my application/registration information with Major League Hacking for event administration, ranking, and MLH administration in-line with the MLH Privacy Policy (https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md). I further agree to the terms of both the MLH Contest Terms and Conditions (https://github.com/MLH/mlh-policies/blob/main/contest-terms.md) and the MLH Privacy Policy (https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md).',
    type: questionType.agreement,
    mlh: true,
    required: true,
    id: '10',
  },
  {
    title:
      'I authorize MLH to send me occasional emails about relevant events, career opportunities, and community announcements.',
    type: questionType.agreement,
    mlh: true,
    required: false,
    id: '0',
  },
];

export const requiredQuestions: FormQuestion[] = [
  {
    title: 'Dietary Restrictions',
    type: questionType.checkbox,
    mlh: true,
    required: false,
    id: '11',
    answerChoices: [
      { value: 'Vegetarian', id: uuidv4() },
      { value: 'Vegan', id: uuidv4() },
      { value: 'Celiac Disease', id: uuidv4() },
      { value: 'Allergies', id: uuidv4() },
      { value: 'Kosher', id: uuidv4() },
      { value: 'Halal', id: uuidv4() },
    ],
  },
  {
    title:
      'Do you identify as part of an underrepresented group in the technology industry?',
    type: questionType.multiplechoice,
    required: false,
    mlh: true,
    id: '12',
    answerChoices: [
      { value: 'Yes', id: uuidv4() },
      { value: 'No', id: uuidv4() },
      { value: 'Unsure', id: uuidv4() },
    ],
  },
  {
    title: 'Gender',
    type: questionType.multiplechoice,
    required: false,
    mlh: true,
    answerChoices: [
      { value: 'Man', id: uuidv4() },
      { value: 'Woman', id: uuidv4() },
      { value: 'Non-Binary', id: uuidv4() },
      { value: 'Prefer Not to self-describe', id: uuidv4() },
      { value: 'Prefer Not to Answer', id: uuidv4() },
    ],
    id: '13',
  },
  {
    title: 'Pronouns',
    type: questionType.multiplechoice,
    required: false,
    mlh: true,
    answerChoices: [
      { value: 'He/Him', id: uuidv4() },
      { value: 'She/Her', id: uuidv4() },
      { value: 'They/Them', id: uuidv4() },
      { value: 'She/They', id: uuidv4() },
      { value: 'He/They', id: uuidv4() },
      { value: 'Prefer Not to Answer', id: uuidv4() },
      { value: 'Other', id: uuidv4() },
    ],
    id: '14',
  },
  {
    title: 'Race / Ethnicity',
    type: questionType.checkbox,
    required: false,
    mlh: true,
    answerChoices: [
      { value: 'American Indian or Alaska Native', id: uuidv4() },
      { value: 'Asian', id: uuidv4() },
      { value: 'Black or African American', id: uuidv4() },
      { value: 'Hispanic or Latino', id: uuidv4() },
      { value: 'Native Hawaiian or Other Pacific Islander', id: uuidv4() },
      { value: 'White', id: uuidv4() },
      { value: 'Prefer not to answer', id: uuidv4() },
      { value: 'Other', id: uuidv4() },
    ],
    id: '15',
  },
  {
    title: 'Do you consider yourself any of the following?',
    mlh: true,
    required: false,
    type: questionType.multiplechoice,
    answerChoices: [
      { value: 'Heterosexual or Straight', id: uuidv4() },
      { value: 'Gay or Lesbian', id: uuidv4() },
      { value: 'Bisexual', id: uuidv4() },
      { value: 'Other', id: uuidv4() },
      { value: 'Prefer not to answer', id: uuidv4() },
    ],
    id: '16',
  },
  {
    title:
      'What is the highest level of formal education that you have completed?',
    mlh: true,
    required: false,
    type: questionType.multiplechoice,
    answerChoices: [
      { value: 'Less than High School', id: uuidv4() },
      { value: 'High School Diploma or Equivalent', id: uuidv4() },
      { value: 'Some College', id: uuidv4() },
      { value: 'Associate Degree', id: uuidv4() },
      { value: 'Bachelor’s Degree', id: uuidv4() },
      { value: 'Master’s Degree', id: uuidv4() },
      { value: 'Professional Degree (MD, JD, etc)', id: uuidv4() },
      { value: 'Doctorate Degree', id: uuidv4() },
      { value: 'Other', id: uuidv4() },
    ],
    id: '17',
  },
  {
    title: 'T-shirt Size',
    mlh: true,
    required: false,
    type: questionType.dropdown,
    answerChoices: [
      { value: 'XS', id: uuidv4() },
      { value: 'S', id: uuidv4() },
      { value: 'M', id: uuidv4() },
      { value: 'L', id: uuidv4() },
      { value: 'XL', id: uuidv4() },
      { value: 'XXL', id: uuidv4() },
      { value: 'XXXL', id: uuidv4() },
    ],
    id: '18',
  },
  {
    title: 'Shipping Address',
    mlh: true,
    required: false,
    type: questionType.address,
    id: '19',
    addressLineOne: '',
    city: '',
    country: '',
    pincode: '',
  },
  {
    title: 'Major/Field of Study',
    mlh: true,
    required: false,
    type: questionType.dropdown,
    answerChoices: [
      { value: 'Computer Science', id: uuidv4() },
      { value: 'Computer Engineering', id: uuidv4() },
      { value: 'Electrical Engineering', id: uuidv4() },
      { value: 'Mechanical Engineering', id: uuidv4() },
      { value: 'Information Technology', id: uuidv4() },
      { value: 'Information Systems', id: uuidv4() },
      { value: 'Cybersecurity', id: uuidv4() },
      { value: 'Other Engineering', id: uuidv4() },
    ],
    id: '20',
  },
];
