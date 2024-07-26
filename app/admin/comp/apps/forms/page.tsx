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

    if (formType.getValue() === 'Application') {
      const form: Form = await createForm(
        competition.competition.code,
        FormType.APPLICATION
      );
      router.push(`${pathname}/edit/application/${form.id}`);
    } else if (formType.getValue() === 'Other') {
      const form: Form = await createForm(
        competition.competition.code,
        FormType.OTHER
      );
      router.push(`${pathname}/edit/general/${form.id}`);
    }
  };

  const rows = data?.map((form: Form) => (
    <Table.Tr
      key={form.id}
      bg={
        selectedRows.includes(form.id)
          ? 'var(--mantine-color-blue-light)'
          : undefined
      }
    >
      <Table.Td>
        <Checkbox
          aria-label='Select row'
          checked={selectedRows.includes(form.id)}
          onChange={(event) =>
            setSelectedRows(
              event.currentTarget.checked
                ? [...selectedRows, form.id]
                : selectedRows.filter((id: string) => id !== form.id)
            )
          }
        />
      </Table.Td>
      <Table.Td>
        <a href={`/admin/comp/apps/forms/edit/application/${form.id}`}>
          {form.title}
        </a>
      </Table.Td>
      <Table.Td>{form.update_at.toString()}</Table.Td>
      <Table.Td>{form.created_at.toString()}</Table.Td>
      <Table.Td></Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Modal opened={opened} onClose={close} title='Form Selection' centered>
        <div className='flex flex-col gap-8'>
          <Select
            {...formType.getInputProps()}
            label='Form Type'
            placeholder='Select form type'
            data={['Application', 'Other']}
          />
          <Button onClick={handleCreateForm}>Create Form</Button>
        </div>
      </Modal>

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
            onClick={open}
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
            <Table.Th />
            <Table.Th>Form Name</Table.Th>
            <Table.Th>Date Modified</Table.Th>
            <Table.Th>Date Created</Table.Th>
            <Table.Th>Creator</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
}
