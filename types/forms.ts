import { Dispatch, SetStateAction, MutableRefObject } from 'react';
import { Form } from '@prisma/client';
import { Question, QuestionType } from '@/types/question';

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
export const FileTypes: FileType[] = [
  FileType.PDF,
  FileType.IMG,
  FileType.VIDEO,
];

export const FileSizes = ['1MB', '10MB', '100MB'];
export const ShortResponseLength = 100;
export const MaxParagraphLength = 10000;

export enum FormErrorTypes {
  Question = 'Question',
  SectionTitle = 'Section',
  NoQuestions = 'NoQuestions',
  NoSections = 'NoSections',
  FormTitle = 'Title',
}

export interface FormValidationError {
  key: string;
  type: FormErrorTypes;
  message: string;
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

export interface FormContext {
  form: Form;
  setForm: Dispatch<SetStateAction<Form>>;
  setSections: Dispatch<SetStateAction<FormSection[]>>;
  errors: FormValidationError[];
  setErrors: Dispatch<SetStateAction<FormValidationError[]>>;
  setStatus: Dispatch<SetStateAction<StatusIndicator>>;
  autosaveTimer: MutableRefObject<NodeJS.Timeout | undefined>;
  save: () => void;
}

export const mlhQuestions: MLHApplication = {
  general: {
    title: 'General',
    description:
      'Note that your responses to these questions will not affect your application.',
    key: 'general',
    questions: [
      {
        title: 'First Name',
        type: QuestionType.shortResponse,
        key: 'First Name',
        settings: {
          required: true,
          maxChars: 100,
        },
      },
      {
        title: 'Last Name',
        type: QuestionType.shortResponse,
        key: 'Last Name',
        settings: {
          required: true,
          maxChars: 100,
        },
      },
      {
        title: 'Age',
        type: QuestionType.dropdown,
        key: 'Age',
        choices: [
          { key: '1', value: '18-24' },
          { key: '2', value: '25-34' },
          { key: '3', value: '35-44' },
          { key: '4', value: '45-54' },
          { key: '5', value: '55-64' },
          { key: '6', value: '65+' },
        ],
        settings: {
          required: true,
        },
      },
      {
        title: 'Phone Number',
        key: 'Phone Number',
        type: QuestionType.phone,
        settings: {
          required: true,
        },
      },
      {
        title: 'Email',
        key: 'Email',
        type: QuestionType.email,
        settings: {
          required: true,
        },
      },
      {
        title: 'School',
        key: 'School',
        type: QuestionType.dropdown,
        choices: [
          { key: '1', value: 'University of Florida' },
          { key: '2', value: 'University of South Florida' },
          { key: '3', value: 'Florida State University' },
          { key: '4', value: 'University of Central Florida' },
          { key: '5', value: 'Florida International University' },
          { key: '6', value: 'Florida Atlantic University' },
          { key: '7', value: 'University of Miami' },
          { key: '8', value: 'Florida Gulf Coast University' },
          { key: '9', value: 'Florida A&M University' },
          { key: '10', value: 'Stetson University' },
          { key: '11', value: 'Embry-Riddle Aeronautical University' },
          { key: '12', value: 'Rollins College' },
          { key: '13', value: 'Florida Institute of Technology' },
          { key: '14', value: 'Other' },
        ],
        settings: {
          required: true,
        },
      },
      {
        title: 'Level of Study',
        key: 'Level of Study',
        type: QuestionType.dropdown,
        settings: { required: true },
        choices: [
          { key: '1', value: 'Less than Secondary / High School' },
          { key: '2', value: 'Secondary / High School' },
          {
            key: '3',
            value:
              'Undergraduate University (2 year - community college or similar)',
          },
          { key: '4', value: 'Undergraduate University (3+ year)' },
          {
            key: '5',
            value: 'Graduate University (Masters, Professional, Doctoral, etc)',
          },
          { key: '6', value: 'Code School / Bottcamp' },
          {
            key: '7',
            value: 'Other Vocational / Trade Program or Apprenticeship',
          },
          { key: '8', value: 'Post Doctorate' },
          { key: '9', value: 'Other' },
          { key: '10', value: "I'm not currently a student" },
          { key: '11', value: 'Prefer not to answer' },
        ],
      },
      {
        title: 'Residence',
        key: 'Residence',
        type: QuestionType.dropdown,
        settings: { required: true },
        choices: [
          { key: '1', value: 'United States' },
          { key: '2', value: 'Canada' },
          { key: '3', value: 'Other' },
        ],
      },
      {
        title: 'Dietary Restrictions',
        key: 'Dietary Restrictions',
        type: QuestionType.dropdown,
        settings: { required: false },
        choices: [
          { key: '2', value: 'Vegetarian' },
          { key: '3', value: 'Vegan' },
          { key: '4', value: 'Celiac Disease' },
          { key: '4', value: 'Allergies' },
          { key: '4', value: 'Kosher' },
          { key: '5', value: 'Halal' },
          { key: '6', value: 'Other' },
        ],
      },
      {
        title: 'Dietary Restrictions (Other)',
        key: 'Dietary Restrictions (Other)',
        type: QuestionType.shortResponse,
        settings: { required: false },
      },
      {
        title:
          'Do you identify as part of an underrepresented group in the technology industry?',
        key: 'Do you identify as part of an underrepresented group in the technology industry?',
        type: QuestionType.dropdown,
        settings: { required: false },
        choices: [
          { key: '1', value: 'Yes' },
          { key: '2', value: 'No' },
          { key: '3', value: 'Unsure' },
        ],
      },
      {
        title: 'Gender',
        key: 'Gender',
        type: QuestionType.dropdown,
        settings: { required: false },
        choices: [
          { key: '1', value: 'Man' },
          { key: '2', value: 'Woman' },
          { key: '3', value: 'Non-Binary' },
          { key: '4', value: 'Prefer not to self-describe' },
          { key: '5', value: 'Prefer not to answer' },
        ],
      },
      {
        title: 'Pronouns',
        key: 'Pronouns',
        type: QuestionType.dropdown,
        settings: { required: false },
        choices: [
          { key: '1', value: 'He/Him' },
          { key: '2', value: 'She/Her' },
          { key: '3', value: 'They/Them' },
          { key: '4', value: 'He/They' },
          { key: '5', value: 'She/They' },
          { key: '6', value: 'Prefer not to answer' },
          { key: '7', value: 'Other' },
        ],
      },
      {
        title: 'Pronouns (Other)',
        key: 'Pronouns (Other)',
        type: QuestionType.shortResponse,
        settings: { required: false },
      },
      {
        title: 'Race/Ethnicity',
        key: 'Race/Ethnicity',
        type: QuestionType.dropdown,
        settings: { required: false },
        choices: [
          { key: '1', value: 'Asian Indian' },
          { key: '2', value: 'Black or African' },
          { key: '3', value: 'Chinese' },
          { key: '4', value: 'Filipino' },
          { key: '5', value: 'Guamanian or Chamorro' },
          { key: '7', value: 'Hispanic / Latino / Spanish Origin' },
          { key: '8', value: 'Japanese' },
          { key: '9', value: 'Korean' },
          { key: '10', value: 'Middle Eastern' },
          { key: '11', value: 'Native American or Alaskan Native' },
          { key: '12', value: 'Native Hawaiian' },
          { key: '13', value: 'Samoan' },
          { key: '14', value: 'Vietnamese' },
          { key: '15', value: 'White' },
          { key: '16', value: 'Other Asian (Thai, Cambodian, etc)' },
          { key: '17', value: 'Other Pacific Islander' },
          { key: '18', value: 'Other (please specify)' },
          { key: '19', value: 'Prefer not to answer' },
        ],
      },
      {
        title: 'Race/Ethnicity (Other)',
        key: 'Race/Ethnicity (Other)',
        type: QuestionType.shortResponse,
        settings: { required: false },
      },
      {
        title: 'Do you consider yourself to be any of the following?',
        key: 'Do you consider yourself to be any of the following?',
        type: QuestionType.dropdown,
        settings: { required: false },
        choices: [
          { key: '1', value: 'Heterosexual or straight' },
          { key: '2', value: 'Gay or lesbian' },
          { key: '3', value: 'Bisexual' },
          { key: '4', value: 'Different identity' },
          { key: '5', value: 'Prefer not to Answer' },
        ],
      },
      {
        title: 'T-shirt size',
        key: 'T-shirt size',
        type: QuestionType.dropdown,
        settings: { required: false },
        choices: [
          { key: '2', value: 'S' },
          { key: '3', value: 'M' },
          { key: '4', value: 'L' },
          { key: '5', value: 'XL' },
        ],
      },
      {
        title: 'Major/Field of Study',
        key: 'Major/Field of Study',
        type: QuestionType.dropdown,
        settings: { required: false },
        choices: [
          {
            key: '1',
            value:
              'Computer science, computer engineering, or software engineering',
          },
          {
            key: '2',
            value:
              'Another engineering discipline (such as civil, electrical, mechanical, etc.)',
          },
          {
            key: '3',
            value:
              'Information systems, information technology, or system administration ',
          },
          {
            key: '4',
            value:
              'A natural science (such as biology, chemistry, physics, etc.)',
          },
          { key: '5', value: 'Mathematics or statistics' },
          { key: '6', value: 'Web development or web design' },
          {
            key: '7',
            value:
              'Business discipline (such as accounting, finance, marketing, etc.)',
          },
          {
            key: '8',
            value:
              'Humanities discipline (such as literature, history, philosophy, etc.) ',
          },
          {
            key: '9',
            value:
              'Social science (such as anthropology, psychology, political science, etc.)',
          },
          {
            key: '10',
            value:
              'Fine arts or performing arts (such as graphic design, music, studio art, etc.)',
          },
          {
            key: '11',
            value:
              'Health science (such as nursing, pharmacy, radiology, etc.)',
          },
          { key: '12', value: 'Other (please specify)' },
          { key: '13', value: 'Undecided / No Declared Major' },
          { key: '14', value: 'Prefer not to answer' },
        ],
      },
    ],
  },
  agreements: {
    title: 'Agreements',
    key: 'swamphacks-x-agreements',
    questions: [
      {
        title:
          'I agree to the MLH Code of Conduct ("https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md")',
        key: 'agreement-1',
        type: QuestionType.agreement,
        settings: {
          required: true,
        },
      },
      {
        title:
          'I authorize you to share my application/registration information with Major League Hacking for event administration, ranking, and MLH administration in-line with the MLH Privacy Policy ("https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md"). I further agree to the terms of both the MLH Contest Terms and Conditions ("https://github.com/MLH/mlh-policies/blob/main/contest-terms.md") and the MLH Privacy Policy ("https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md").',
        key: 'agreement-2',
        type: QuestionType.agreement,
        settings: {
          required: true,
        },
      },
      {
        title:
          'I authorize MLH to send me occasional emails about relevant events, career opportunities, and community announcements.',
        key: 'agreemnt-3',
        type: QuestionType.agreement,
        settings: {
          required: false,
        },
      },
    ],
  },
};
