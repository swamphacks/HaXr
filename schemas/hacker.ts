import * as yup from 'yup';

export const applicationSchema = yup.object().shape({
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
