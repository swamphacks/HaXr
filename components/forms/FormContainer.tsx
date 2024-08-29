import { getFormResponse, getUser } from '@/app/actions/forms';
import { Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { Form } from '@prisma/client';
import { FormSection } from '@/types/forms';
import FormContent from '@/components/forms/FormContent';

export default async function FormContainer({
  form,
  userEmail,
}: {
  form: Form | null;
  userEmail: string;
}) {
  const user = await getUser(userEmail);

  if (!form) {
    return (
      <div className='flex flex-col items-center justify-center'>
        <Alert
          variant='light'
          color='red'
          title='Form not found'
          icon={<IconInfoCircle />}
        >
          The form you are looking for was not found. The form may have closed
          or been deleted. If you were in the process of editing the form before
          the form closed, it has been auto-submitted. If you believe this is an
          error, please contact the event organizers.
        </Alert>
      </div>
    );
  }

  const formSections = form.sections as unknown as FormSection[];
  if (
    !formSections ||
    ['number', 'string', 'boolean'].includes(typeof formSections) ||
    !Array.isArray(formSections)
  ) {
    return (
      <Alert
        variant='light'
        color='red'
        title='Form not found'
        icon={<IconInfoCircle />}
      >
        The form is malformed. Please contact the event organizers.
      </Alert>
    );
  }

  if (!user) {
    return (
      <div className='flex flex-col items-center justify-center'>
        <Alert
          variant='light'
          color='red'
          title='User not found'
          icon={<IconInfoCircle />}
        >
          The user you are looking for was not found. If you believe this is an
          error, please contact the event organizers.
        </Alert>
      </div>
    );
  }

  const response = await getFormResponse(form.id, user.id);

  return <FormContent prismaForm={form} user={user} userResponse={response} />;
}
