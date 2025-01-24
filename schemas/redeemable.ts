import * as yup from 'yup';

yup.addMethod(yup.string, 'nullToUndefined', function nullToUndefined() {
  return this.transform((value) => (value === null ? undefined : value));
});

const descriptionLength = 500;
const descriptionError = `Keep it under ${descriptionLength} characters.`;

export const createRedeemableSchema = yup
  .object()
  .strict(true)
  .noUnknown()
  .shape({
    name: yup
      .string()
      .trim()
      .min(1, 'Name must be at leaset 1 character')
      .required('Please provide a name'),
    competitionCode: yup
      .string()
      .trim()
      .min(1, 'Competition code must be at least 1 character')
      .required('Please provide a competition code'),
    description: yup
      .string()
      .trim()
      .optional()
      .max(descriptionLength, descriptionError),
    quantity: yup
      .number()
      .integer()
      .required()
      .min(0, 'Quantity must be at least 0'),
  });

export const updateRedeemableSchema = yup
  .object()
  .strict(true)
  .noUnknown()
  .shape({
    name: yup.string().optional().min(1, 'Name must be at least 1 character'),
    competitionCode: yup
      .string()
      .optional()
      .trim()
      .min(1, 'Competition code must be at least 1 character'),
    description: yup
      .string()
      .trim()
      .optional()
      .max(descriptionLength, descriptionError),
    quantity: yup.number().integer().optional(),
  });

export const getRedeemableSchema = yup
  .object()
  .strict(true)
  .noUnknown()
  .shape({
    competitionCode: yup.string().trim().optional(),
    name: yup.string().trim().optional(),
    limit: yup
      .number()
      .integer()
      .default(() => 50)
      .min(1, 'Limit must be at least 1')
      .max(1000, 'Limit must be at most 1000'),
    sort: yup
      .string()
      .trim()
      .default(() => 'desc')
      .lowercase()
      .oneOf(['asc', 'desc']),
    cursor: yup.object().optional().shape({
      competitionCode: yup.string().trim().optional(),
      name: yup.string().trim().optional(),
    }),
  });

export const createTransactionSchema = yup
  .object()
  .strict(true)
  .noUnknown()
  .shape({
    competitionCode: yup
      .string()
      .trim()
      .required('Please provide a competition code'),
    userId: yup.string().trim().required('Please provide a user ID'),
    redeemableName: yup
      .string()
      .trim()
      .required('Please provide a redeemable name'),
    quantity: yup
      .number()
      .integer()
      .notOneOf([0])
      .required('Please provide a quantity'),
  });

export const getTransactionSchema = yup
  .object()
  .strict(true)
  .noUnknown()
  .shape({
    limit: yup
      .number()
      .integer()
      .optional()
      .default(50)
      .positive()
      .max(1000, 'Limit must be at most 1000'),
    cursor: yup.string().optional().nullable(),
    sort: yup
      .string()
      .optional()
      .trim()
      .lowercase()
      .default('desc')
      .oneOf(['asc', 'desc']),
    competitionCode: yup.string().trim().optional(),
    userId: yup.string().trim().optional(),
    redeemableName: yup.string().trim().optional(),
  });
