import { questionType } from '@/types/questionTypes';
import { MLHApplication, ApplicationResponse } from '@/types/forms';

export const mlhQuestions: MLHApplication = {
  general: {
    title: 'General',
    description:
      'Note that your responses to these questions will not affect your application.',
    key: 'swamphacks-x-general',
    questions: [
      {
        title: 'First Name',
        type: questionType.shortResponse,
        key: '1',
        settings: {
          required: true,
          maxChars: 100,
        },
      },
      {
        title: 'Last Name',
        type: questionType.shortResponse,
        key: '2',
        settings: {
          required: true,
          maxChars: 100,
        },
      },
      {
        title: 'Age',
        type: questionType.dropdown,
        key: '3',
        choices: [
          'Under 18',
          '18-24',
          '25-34',
          '35-44',
          '45-54',
          '55-64',
          '65+',
        ],
        settings: {
          required: true,
        },
      },
      {
        title: 'Email',
        type: questionType.email,
        key: '4',
        settings: {
          required: true,
        },
      },
      {
        title: 'Phone Number',
        type: questionType.phone,
        key: '19',
        settings: {
          required: true,
        },
      },
      {
        title: 'School',
        type: questionType.dropdown,
        key: '5',
        choices: [
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
        ],
        settings: {
          required: true,
        },
      },
      {
        title: 'Level of Studies',
        type: questionType.dropdown,
        settings: { required: true },
        choices: [
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
        ],
        key: '6',
      },
      {
        title: 'Major/Field of Study',
        type: questionType.dropdown,
        settings: { required: false },
        choices: [
          'Computer Science',
          'Information Technology',
          'Information Systems',
          'Cybersecurity',
          'Computer Engineering',
          'Software Engineering',
          'Web Development',
          'Network Engineering',
        ],
        key: '7',
      },
      {
        title: 'Residence',
        type: questionType.dropdown,
        settings: { required: true },
        choices: [
          'Florida',
          'Georgia',
          'Alabama',
          'Mississippi',
          'Louisiana',
          'Texas',
          'Other',
        ],
        key: '8',
      },
      {
        title:
          'Do you identify as part of an underrepresented group in the technology industry?',
        type: questionType.dropdown,
        settings: { required: false },
        choices: ['Yes', 'No', 'Prefer not to answer'],
        key: '9',
      },
      {
        title: 'Gender',
        type: questionType.dropdown,
        settings: { required: false },
        choices: [
          'Man',
          'Woman',
          'Non-Binary',
          'Prefer not to self-describe',
          'Prefer not to answer',
        ],
        key: '10',
      },
      {
        title: 'Pronouns',
        type: questionType.dropdown,
        settings: { required: false },
        choices: [
          'He/Him',
          'She/Her',
          'They/Them',
          'He/They',
          'She/They',
          'Prefer not to answer',
          'Other',
        ],
        key: '11',
      },
      {
        title: 'Race',
        type: questionType.dropdown,
        settings: { required: false },
        choices: [
          'American Indian or Alaska Native',
          'Asian',
          'Black or African American',
          'Hispanic or Latino',
          'Native Hawaiian or Other Pacific Islander',
          'White',
          'Other',
          'Prefer not to answer',
        ],
        key: '12',
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
        type: questionType.agreement,
        settings: {
          required: true,
        },
        key: '13',
      },
      {
        title:
          'I authorize you to share my application/registration information with Major League Hacking for event administration, ranking, and MLH administration in-line with the MLH Privacy Policy ("https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md"). I further agree to the terms of both the MLH Contest Terms and Conditions ("https://github.com/MLH/mlh-policies/blob/main/contest-terms.md") and the MLH Privacy Policy ("https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md").',
        key: '14',
        type: questionType.agreement,
        settings: {
          required: true,
        },
      },
      {
        title:
          'I authorize MLH to send me occasional emails about relevant events, career opportunities, and community announcements.',
        key: '15',
        type: questionType.agreement,
        settings: {
          required: false,
        },
      },
    ],
  },
};

export interface MantineForm extends Record<string, any> {}

export const mantineForm: MantineForm = {
  1: '',
  2: '',
  3: '',
  4: '',
  5: '',
  6: '',
  7: '',
  8: '',
  9: '',
  10: '',
  11: '',
  12: '',
  19: '',
  13: false,
  14: false,
  15: false,
  16: '',
  17: '',
  18: '',
};
