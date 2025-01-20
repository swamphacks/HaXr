import * as yup from 'yup';

export const createRedeemableSchema = yup.object().shape({
  name: yup.string().required('Please provide a name'),
  competitionCode: yup.string().required('Please provide a competition code'),
  description: yup
    .string()
    .optional()
    .nullable()
    .max(500, 'Keep it under 500 characters.'),
});

export const updateRedeemableSchema = yup.object().shape({
  old: createRedeemableSchema.required('Please provide all old values'),
  new: createRedeemableSchema.required('Please provide all new values'),
});
