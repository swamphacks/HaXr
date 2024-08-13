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
          { key: '0', value: 'Under 18' },
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
        title: 'Level of Studies',
        type: questionType.dropdown,
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
        key: '6',
      },
      {
        title: 'Major/Field of Study',
        type: questionType.dropdown,
        settings: { required: false },
        choices: [
          { key: '1', value: 'Computer Science' },
          { key: '2', value: 'Information Technology' },
          { key: '3', value: 'Information Systems' },
          { key: '4', value: 'Cybersecurity' },
          { key: '5', value: 'Computer Engineering' },
          { key: '6', value: 'Software Engineering' },
          { key: '7', value: 'Web Development' },
          { key: '8', value: 'Network Engineering' },
        ],
        key: '7',
      },
      {
        title: 'Residence',
        type: questionType.dropdown,
        settings: { required: true },
        choices: [
          { key: '1', value: 'Florida' },
          { key: '2', value: 'Georgia' },
          { key: '3', value: 'Alabama' },
          { key: '4', value: 'Mississippi' },
          { key: '5', value: 'Louisiana' },
          { key: '6', value: 'Texas' },
          { key: '7', value: 'Other' },
        ],
        key: '8',
      },
      {
        title:
          'Do you identify as part of an underrepresented group in the technology industry?',
        type: questionType.dropdown,
        settings: { required: false },
        choices: [
          { key: '1', value: 'Yes' },
          { key: '2', value: 'No' },
          { key: '3', value: 'Prefer not to answer' },
        ],
        key: '9',
      },
      {
        title: 'Gender',
        type: questionType.dropdown,
        settings: { required: false },
        choices: [
          { key: '1', value: 'Man' },
          { key: '2', value: 'Woman' },
          { key: '3', value: 'Non-Binary' },
          { key: '4', value: 'Prefer not to self-describe' },
          { key: '5', value: 'Prefer not to answer' },
        ],
        key: '10',
      },
      {
        title: 'Pronouns',
        type: questionType.dropdown,
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
        key: '11',
      },
      {
        title: 'Race',
        type: questionType.dropdown,
        settings: { required: false },
        choices: [
          { key: '1', value: 'American Indian or Alaska Native' },
          { key: '2', value: 'Asian' },
          { key: '3', value: 'Black or African American' },
          { key: '4', value: 'Hispanic or Latino' },
          { key: '5', value: 'Native Hawaiian or Other Pacific Islander' },
          { key: '7', value: 'White' },
          { key: '8', value: 'Other' },
          { key: '9', value: 'Prefer not to answer' },
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
