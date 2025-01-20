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
      .nullable()
      .optional()
      .max(descriptionLength, descriptionError),
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
      .nullable()
      .optional()
      .max(descriptionLength, descriptionError),
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
