'use client';
import { Form, useForm, yupResolver } from '@mantine/form';
import {
  Anchor,
  Box,
  Button,
  Divider,
  Fieldset,
  NumberInput,
  Stack,
  Textarea,
  TextInput,
} from '@mantine/core';
import {
  IconApi,
  IconCalendar,
  IconCheck,
  IconCircleDashedCheck,
  IconConfetti,
  IconEye,
  IconKeyframe,
  IconKeyframesFilled,
  IconLink,
  IconMap,
  IconNorthStar,
  IconUsersGroup,
  IconWriting,
  IconWritingOff,
  IconX,
} from '@tabler/icons-react';
import Link from 'next/link';
import { DateInput, DateTimePicker } from '@mantine/dates';
import { Competition } from '@prisma/client';
import { updateCompetitionConfig } from '@/actions/competition';
import { notifications } from '@mantine/notifications';
import { competitionConfigurationFormSchema } from '@/schemas/admin';

interface Props {
  competition: Competition;
}

export default function ConfigureCompetition({ competition }: Props) {
  const form = useForm({
    mode: 'uncontrolled',
    validate: yupResolver(competitionConfigurationFormSchema),
    initialValues: competition,
    transformValues: (values) => ({
      ...values,
      max_attendees: values.max_attendees || null,
    }),
  });

  return (
    <Box mx='auto' maw={500}>
      <Form
        form={form}
        onSubmit={async (vals: Competition) => {
          const id = notifications.show({
            loading: true,
            title: 'Saving configuration',
            message: null,
            autoClose: false,
            withCloseButton: false,
          });

          if (competition) {
            if (await updateCompetitionConfig(competition.code, vals)) {
              notifications.update({
                id,
                loading: false,
                icon: <IconCheck />,
                color: 'green',
                title: 'Successfully save configuration',
                message: (
                  <>
                    Changes are immediate but may need to{' '}
                    <Anchor href='' inherit>
                      refresh
                    </Anchor>{' '}
                    to see them.
                  </>
                ),
                autoClose: true,
                withCloseButton: true,
              });
            } else {
              notifications.update({
                id,
                loading: false,
                icon: <IconX />,
                color: 'red',
                title: 'Failed saving configuration',
                message: 'Server update action failed to save configuration.',
                autoClose: true,
                withCloseButton: true,
              });
            }
          } else {
            notifications.update({
              id,
              loading: false,
              icon: <IconX />,
              color: 'red',
              title: 'Failed saving configuration',
              message: 'Competition context has not loaded yet. Try again.',
              autoClose: true,
              withCloseButton: true,
            });
          }
        }}
      >
        <Stack>
          <Fieldset legend='General Information' w='100%'>
            <Stack gap='xs'>
              <TextInput
                disabled
                withAsterisk
                leftSection={<IconApi size={16} />}
                label='Competition Code'
                placeholder='x'
                description='Used as a unique ID for API calls and cannot be changed once designated'
                key={form.key('code')}
                {...form.getInputProps('code')}
              />

              <TextInput
                withAsterisk
                label='Competition Name'
                placeholder='SwampHacks X'
                description='Friendly user-facing name'
                key={form.key('name')}
                {...form.getInputProps('name')}
              />

              <TextInput
                withAsterisk
                leftSection={<IconLink size={16} />}
                label='Frontpage URL'
                placeholder='https://x.swamphacks.com'
                description='Should be the subdomain for the frontpage'
                key={form.key('frontpage_url')}
                {...form.getInputProps('frontpage_url')}
              />

              <Textarea
                label='Description'
                placeholder='Really cool hackathon!'
                key={form.key('description')}
                {...form.getInputProps('description')}
                autosize
                minRows={4}
              />

              <Divider label='When & Where ' />

              <DateInput
                withAsterisk
                leftSection={<IconCalendar size={16} />}
                label='Start Date'
                placeholder='March 14, 2015'
                key={form.key('start_date')}
                {...form.getInputProps('start_date')}
              />

              <DateInput
                withAsterisk
                leftSection={<IconCalendar size={16} />}
                label='End Date'
                placeholder='March 15, 2015'
                key={form.key('end_date')}
                {...form.getInputProps('end_date')}
              />

              <TextInput
                withAsterisk
                leftSection={<IconNorthStar size={16} />}
                label='Location'
                placeholder='Malachowsky Hall'
                description='Should be easily identifiable to new-comers'
                key={form.key('location')}
                {...form.getInputProps('location')}
              />

              <TextInput
                withAsterisk
                leftSection={<IconMap size={16} />}
                label='Location URL'
                placeholder='https://maps.app.goo.gl/...'
                description={
                  <>
                    <i>Copy Link</i> from Share in{' '}
                    <Link href='https://maps.google.com' target='_blank'>
                      <u>Google Maps</u>
                    </Link>
                  </>
                }
                key={form.key('location_url')}
                {...form.getInputProps('location_url')}
              />
            </Stack>
          </Fieldset>

          <Fieldset legend='Application Settings' w='100%'>
            <Stack gap='xs'>
              <DateTimePicker
                withAsterisk
                leftSection={<IconEye />}
                label='Preview on Portal'
                description='Can be the same as the application open (no coming soon card)'
                valueFormat='MMMM D, YYYY [at] hh:mm A'
                placeholder='January 1, 2015 at 12:00 AM'
                key={form.key('preview')}
                {...form.getInputProps('preview')}
              />

              <DateTimePicker
                withAsterisk
                leftSection={<IconWriting />}
                label='Applications Open'
                valueFormat='MMMM D, YYYY [at] hh:mm A'
                placeholder='January 8, 2015 at 12:00 AM'
                key={form.key('apply_open')}
                {...form.getInputProps('apply_open')}
              />

              <DateTimePicker
                withAsterisk
                leftSection={<IconWritingOff />}
                label='Application Close'
                valueFormat='MMMM D, YYYY [at] hh:mm A'
                placeholder='January 31, 2015 at 11:59 PM'
                key={form.key('apply_close')}
                {...form.getInputProps('apply_close')}
              />

              <DateTimePicker
                withAsterisk
                leftSection={<IconConfetti />}
                label='Decision Release'
                description='Application status change notifications will be silenced until this date'
                valueFormat='MMMM D, YYYY [at] hh:mm A'
                placeholder='February 7, 2015 at 6:28 PM'
                key={form.key('decision_release')}
                {...form.getInputProps('decision_release')}
              />

              <DateTimePicker
                withAsterisk
                leftSection={<IconCircleDashedCheck />}
                label='Confirm By'
                description='Accepted applicants must confirm their attendance by this date'
                valueFormat='MMMM D, YYYY [at] hh:mm A'
                placeholder='February 21, 2015 at 11:59 PM'
                key={form.key('confirm_by')}
                {...form.getInputProps('confirm_by')}
              />

              <DateTimePicker
                clearable
                leftSection={<IconKeyframesFilled />}
                label='Waitlist Open'
                description='Waitlisted applicants can be promoted to attending after this date'
                valueFormat='MMMM D, YYYY [at] hh:mm A'
                placeholder='February 22, 2015 at 10:00 AM'
                key={form.key('waitlist_open')}
                {...form.getInputProps('waitlist_open')}
              />

              <DateTimePicker
                clearable
                leftSection={<IconKeyframe />}
                label='Waitlist Close'
                description='Waitlisted applicants must secure their seat by this date'
                valueFormat='MMMM D, YYYY [at] hh:mm A'
                placeholder='March 14, 2015 at 7:00 AM'
                key={form.key('waitlist_close')}
                {...form.getInputProps('waitlist_close')}
              />

              <NumberInput
                allowDecimal={false}
                allowNegative={false}
                leftSection={<IconUsersGroup />}
                label='Max Attendees (for Waitlist)'
                description='Waitlisted applicants can be promoted to attending only if there are seats available from this number'
                placeholder='300'
                key={form.key('max_attendees')}
                {...form.getInputProps('max_attendees')}
              />
            </Stack>
          </Fieldset>

          <Button type='submit' w='100%'>
            Save
          </Button>
        </Stack>
      </Form>
    </Box>
  );
}
