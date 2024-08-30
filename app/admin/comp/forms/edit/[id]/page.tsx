import { CreateApplication } from '@/components/formCreator/FormCreator';
import { getFormForCreator } from '@/app/actions/forms';
import { IconInfoCircle } from '@tabler/icons-react';
import { Alert } from '@mantine/core';

export default async function Creator({ params }: { params: { id: string } }) {
  const form = await getFormForCreator(params.id);
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

  const formSections = form.sections;
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
  return <CreateApplication initialForm={form} />;
}
