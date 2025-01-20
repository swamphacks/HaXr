import * as yup from 'yup';

export const createTransactionSchema = yup.object().shape({
  competitionCode: yup.string().required('Please provide a competition code'),
  userId: yup.string().required('Please provide a user ID'),
  redeemableName: yup.string().required('Please provide a redeemable name'),
  quantity: yup.number().required('Please provide a quantity'),
});

export const getTransactionSchema = yup.object().shape({
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
  competitionCode: yup.string().optional().nullable(),
  userId: yup.string().optional().nullable(),
  redeemableName: yup.string().optional().nullable(),
});
