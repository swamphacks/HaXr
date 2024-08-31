import { getFormResponse, getUser } from '@/app/actions/forms';
import { Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { Form } from '@prisma/client';
import { FormSection } from '@/types/forms';
import FormContent from '@/components/forms/FormContent';
import { mlhSchools } from '@/utils/mlhSchools';

async function fetchMLHSchools(): Promise<string[]> {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/MLH/mlh-policies/main/schools.csv'
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch the CSV file: ${response.statusText}`);
    }
    const csvText = await response.text();
    // Split the CSV content into an array of strings, one for each line
    const csvLines = csvText.split('\n');
    return csvLines;
  } catch (error) {
    console.error('Error fetching the CSV file:', error);
    throw error;
  }
}

async function fetchCountryNames(): Promise<string[]> {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/all/all.csv'
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch the CSV file: ${response.statusText}`);
    }
    const csvText = await response.text();
    const csvLines = csvText.split('\n');

    // Extract the header to find the index of the 'name' column
    const headers = csvLines[0].split(',');
    const nameIndex = headers.indexOf('name');

    if (nameIndex === -1) {
      throw new Error('No "name" column found in the CSV file.');
    }

    // Iterate over the lines and collect the country names
    const countryNames: string[] = csvLines
      .slice(1)
      .map((line) => {
        const columns = line.split(',');
        return columns[nameIndex];
      })
      .filter((name) => name); // Filter out empty or undefined names

    return countryNames;
  } catch (error) {
    console.error('Error fetching or parsing the CSV file:', error);
    throw error;
  }
}

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

  if (form.is_mlh) {
    Promise.all([fetchMLHSchools(), fetchCountryNames()]).then(
      ([schools, countries]) => {}
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
