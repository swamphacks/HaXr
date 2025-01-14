import * as yup from 'yup';

export const competitionConfigurationFormSchema = yup.object().shape({
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
  waitlist_open: yup
    .date()
    .nullable()
    .min(
      yup.ref('decision_release'),
      'Waitlist can only `open after decisions are released'
    ),
  waitlist_close: yup
    .date()
    .nullable()
    .min(yup.ref('waitlist_open'), 'Waitlist cannot close before it opens')
    .when('waitlist_open', {
      is: null,
      then: (schema) =>
        schema.oneOf([null], 'Waitlist cannot close without opening'),
    }),
  max_attendees: yup
    .number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .min(1, 'Max attendees must be positive')
    .integer("Max attendees can't be a decimal"),
});
