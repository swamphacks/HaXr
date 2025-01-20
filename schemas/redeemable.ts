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

export const getRedeemableSchema = yup.object().shape({
  competitionCode: yup.string().optional().nullable(),
  name: yup.string().optional().nullable(),
  limit: yup
    .number()
    .optional()
    .nullable()
    .default(50)
    .min(1, 'Limit must be at least 1')
    .max(1000, 'Limit must be at most 1000'),
  cursor: yup.string().optional().nullable(),
  sort: yup
    .string()
    .optional()
    .nullable()
    .lowercase()
    .default('desc')
    .oneOf(['asc', 'desc']),
});
