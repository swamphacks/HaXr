import fs from 'fs';
import path from 'path';
import { getFormResponse, getUser } from '@/app/actions/forms';
import { Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { Form } from '@prisma/client';
import { FormSection, mlhQuestions } from '@/types/forms';
import { Choice } from '@/types/question';
import FormContent from '@/components/forms/FormContent';

function fetchMLHSchools(): string[] {
  const filePath = path.join(process.cwd(), 'public', 'form', 'schools.csv');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const membership = new Set();
  return fileContent
    .split('\n')
    .slice(1)
    .filter((school) => {
      if (membership.has(school)) {
        return false;
      }
      membership.add(school);
      return true;
    })
    .map((school) => school.replace(/"/g, ''));
}

function fetchCountryNames(): string[] {
  try {
    const filePath = path.join(
      process.cwd(),
      'public',
      'form',
      'countries.csv'
    );
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    const headers = parseCSVLine(lines[0]);
    const nameIndex = headers.indexOf('name');
    if (nameIndex === -1) {
      throw new Error('No "name" column found in the CSV file.');
    }
    return lines
      .slice(1)
      .map((line) => {
        const columns = parseCSVLine(line);
        return columns[nameIndex];
      })
      .filter((name) => name); // Filter out empty or undefined names
  } catch (error) {
    console.error('Error fetching or parsing the CSV file:', error);
    throw error;
  }
}

// Helper function to parse a CSV line, taking into account quoted fields
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      insideQuotes = !insideQuotes; // Toggle the insideQuotes flag
    } else if (char === ',' && !insideQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  // Add the last field
  result.push(current);

  return result.map((field) => field.trim());
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
      ([schools, countries]) => {
        mlhQuestions.general.questions.forEach((question) => {
          if (question.title === 'School') {
            question.choices = schools.map((school, i) => {
              return { key: i, value: school } as unknown as Choice;
            });
          } else if (question.title === 'Residence') {
            question.choices = countries.map((country, i) => {
              return { key: i, value: country } as unknown as Choice;
            });
            console.log(question.choices);
          }
        });
      }
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

  return (
    <FormContent
      prismaForm={form}
      user={user}
      userResponse={response}
      mlhQuestions={mlhQuestions}
    />
  );
}
