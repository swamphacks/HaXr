import * as yup from 'yup';

export const getAttendeeOptionsSchema = yup.object().shape({
  user: yup.boolean().default(false),
});
