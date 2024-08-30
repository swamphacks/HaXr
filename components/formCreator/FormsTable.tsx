'use client';

import { Form, Competition } from '@prisma/client';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Button, TextInput, Table, rem } from '@mantine/core';
import { IconSearch, IconEdit } from '@tabler/icons-react';
import { CompetitionContext } from '@/components/admin/AdminShell';
import { createForm } from '@/app/actions/forms';
import { Title } from '@mantine/core';

function FormRows({
  forms,
  competition,
}: {
  forms: Form[];
  competition?: Competition;
}) {
  const convertDate = (dateString: Date) => {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat('en-US', { month: 'long' });
    let hour = date.getHours();
    const dayHalf = hour >= 12 ? 'PM' : 'AM';
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;
    const minutes = date.getMinutes();
    return `${formatter.format(date)} ${date.getDate()}, ${date.getFullYear()} ${hour}:${minutes < 10 ? '0' + minutes.toString() : minutes} ${dayHalf}`;
  };

  return forms.map((form: Form) =>
    !competition || form.competition_code === competition.code ? (
      <Table.Tr key={form.id}>
        <Table.Td>
          <a href={`/admin/comp/forms/edit/${form.id}`}>{form.title}</a>
        </Table.Td>
        <Table.Td>{convertDate(form.update_at)}</Table.Td>
        <Table.Td>{convertDate(form.created_at)}</Table.Td>
      </Table.Tr>
    ) : null
  );
}

export default function FormsTable({ forms }: { forms: Form[] }) {
  const router = useRouter();
  const competition = useContext(CompetitionContext);

  const handleCreateForm = async () => {
    // Sanity check - shouldn't be possible to create without a competition
    if (!competition.competition) {
      console.error('No competition selected');
      return;
    }

    const form: Form = await createForm(competition.competition.code);
    router.push(`/admin/comp/forms/edit/${form.id}`);
  };

  return (
    <>
      <div className='mb-2 flex flex-row'>
        {competition.competition ? (
          <>
            <Title order={1} styles={{ root: { flexGrow: 2 } }}>
              Displaying Forms for {competition.competition.name}
            </Title>
            <Button
              leftSection={<IconEdit size='1rem' />}
              radius='xl'
              onClick={handleCreateForm}
            >
              Create Form
            </Button>
          </>
        ) : (
          <Title order={1}>Displaying Forms for All Competitions</Title>
        )}
      </div>
      <Table highlightOnHover={true}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Form Name</Table.Th>
            <Table.Th>Date Modified</Table.Th>
            <Table.Th>Date Created</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <FormRows forms={forms} competition={competition.competition} />
        </Table.Tbody>
      </Table>
    </>
  );
}
