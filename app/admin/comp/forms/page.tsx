'use client';

import { useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Button,
  TextInput,
  Table,
  Checkbox,
  Modal,
  Select,
  rem,
} from '@mantine/core';
import { useField } from '@mantine/form';
import { IconSearch, IconEdit } from '@tabler/icons-react';
import { CompetitionContext } from '@/components/admin/AdminShell';
import { Form, FormType } from '@prisma/client';
import { createForm } from '@/app/actions/Forms';
import { useDisclosure } from '@mantine/hooks';
import useSWR from 'swr';

// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Forms() {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const competition = useContext(CompetitionContext);

  const { data } = useSWR<Form[]>(
    `/api/comp/${competition.competition?.code}/forms`,
    fetcher,
    { fallbackData: [] }
  );

  // The type of form to create
  const formType = useField({
    initialValue: '',
    validate: (value) => value.length > 0,
  });

  const handleCreateForm = async () => {
    if (!competition.competition) {
      console.error('No competition selected');
      return;
    }

    const form: Form = await createForm(
      competition.competition.code,
      FormType.APPLICATION
    );
    router.push(`/admin/comp/forms/edit/${form.id}`);
  };

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

  const rows = data?.map((form: Form) => (
    <Table.Tr key={form.id}>
      <Table.Td>
        <a href={`/admin/comp/forms/edit/${form.id}`}>{form.title}</a>
      </Table.Td>
      <Table.Td>{convertDate(form.update_at)}</Table.Td>
      <Table.Td>{convertDate(form.created_at)}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <div className='mb-4 flex flex-row items-center'>
        <TextInput
          radius='xl'
          size='sm'
          placeholder='Search forms'
          rightSectionWidth={42}
          leftSection={
            <IconSearch
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          }
          styles={{
            root: {
              flexGrow: 1,
              paddingRight: rem(5),
            },
          }}
        />
        {competition.competition ? (
          <Button
            leftSection={<IconEdit size='1rem' />}
            radius='xl'
            onClick={handleCreateForm}
          >
            Create Form
          </Button>
        ) : null}
      </div>
      <div className='mb-2 grid grid-cols-[auto_40%]'>
        <div className='self-center text-[1.4rem]'>
          {competition.competition ? (
            <h1>Displaying Forms for {competition.competition.name}</h1>
          ) : (
            <h1>Displaying Forms for All Competitions</h1>
          )}
        </div>
      </div>
      <Table highlightOnHover={true}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Form Name</Table.Th>
            <Table.Th>Date Modified</Table.Th>
            <Table.Th>Date Created</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
}
