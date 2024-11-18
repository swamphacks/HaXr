import * as yup from 'yup';
export const profileConfigurationScheme = yup.object().shape({
  firstName: yup.string(),
  lastName: yup.string(),
  school: yup.string(),
  email: yup.string().email(),
  phone: yup
    .string()
    .test(
      'is-10-digits',
      'Must provide a valid phone number with exactly 10 digits.',
      (value) => {
        if (!value) return false;
        const strippedValue = value.replace(/\D/g, ''); // Remove all non-digit characters
        return strippedValue.length === 10;
      }
    ),
  bio: yup.string().max(500, 'Keep it under 500 characters.'),
  githubURL: yup
    .string()
    .url('Please enter a valid url.')
    .matches(/github.com/, {
      message: 'Please enter a valid GitHub URL.',
    }),
  linkedinURL: yup
    .string()
    .url('Please enter a valid url.')
    .matches(/linkedin.com/, {
      message: 'Please enter a valid LinkedIn URL.',
    }),
});

export const competitionConfigurationSchema = yup.object().shape({
  code: yup
    .string()
    .required('Must designate a short code identifier (e.g. "x")'),
  name: yup.string().required('Must provide a name (e.g. "SwampHacks X")'),
  description: yup.string().nullable(),
  frontpage_url: yup.string().url().required('Must provide a URL'),
  start_date: yup
    .date()
    .typeError('Must specify a date')
    .required('Must specify the start date'),
  end_date: yup
    .date()
    .typeError('Must specify a date')
    .required('Must specify the end date')
    .min(yup.ref('start_date'), 'End date cannot be before the start date'),
  location: yup.string().required('Must specify a location'),
  location_url: yup.string().url().required('Must provide a URL'),

  preview: yup
    .date()
    .required(
      'Must specify a preview date (can be the same as registration open)'
    ),
  apply_open: yup
    .date()
    .required('Must specify when registration opens')
    .min(
      yup.ref('preview'),
      'Applications can only open after the competition is visible'
    ),
  apply_close: yup
    .date()
    .required('Must specify when registration closes')
    .min(yup.ref('apply_open'), 'Applications can only close after they open'),
  decision_release: yup
    .date()
    .required('Must specify when decisions are released')
    .min(
      yup.ref('apply_close'),
      'Decisions can only be released after the competition is visible'
    ),
  confirm_by: yup
    .date()
    .required('Must specify by when applicants must confirm their attendance')
    .min(
      yup.ref('decision_release'),
      'Hackers can only confirm after decisions are released'
    )
    .max(
      yup.ref('start_date'),
      'Hackers must confirm attendance before the competition begins'
    ),
});

export const applicationConfigurationSchema = yup.object().shape({
  firstName: yup.string().required('Must provide a first name'),
  lastName: yup.string().required('Must provide a last name'),
  email: yup
    .string()
    .email('Must be a valid email')
    .required('Must provide an email address'),
  phoneNumber: yup
    .string()
    .length(14, 'Must provide a valid 10 digit phone number.')
    .required('Must provide a phone number'),
  age: yup.string().required('Must provide an age'),
  certAge: yup.boolean().oneOf([true], 'Must be 18 years or older'),
  school: yup.string().required('Must provide a school'),
  levelOfStudy: yup.string().required('Must provide a level of study'),
  major: yup.string().required('Must provide a major'),
  graduationMonth: yup.string().required('Must provide a graduation month'),
  graduationYear: yup.string().required('Must provide a graduation year'),
  hackathonExperience: yup
    .string()
    .required('Must provide hackathon experience'),
  teamStatus: yup.string().required('Must provide a team status'),
  tshirtSize: yup.string().required('Must provide a tshirt size'),
  dietaryRestrictions: yup
    .array()
    .required('Must provide dietary restrictions'),
  referralSource: yup.array().required('Must provide a referral source'),
  photoConsent: yup.boolean().oneOf([true], 'Must agree to photo consent'),
  inPersonConsent: yup
    .boolean()
    .oneOf([true], 'Must agree to in-person attendance'),
  codeOfConductConsent: yup
    .boolean()
    .oneOf([true], 'Must agree to code of conduct consent'),
});
