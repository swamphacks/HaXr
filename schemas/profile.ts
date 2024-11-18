import * as yup from 'yup';

export const profileSchema = yup.object().shape({
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
