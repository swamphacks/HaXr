'use client';

import { useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, TextInput, rem } from '@mantine/core';
import { IconSearch, IconEdit } from '@tabler/icons-react';
import { Table, Checkbox } from '@mantine/core';
import { CompetitionContext } from '@/components/admin/AdminShell';

const forms = [
  {
    name: 'SwampHacks X Application',
    dateModified: '01/01/2021',
    dateCreated: '01/01/2020',
    creator: 'Matthew DeGuzman',
  },
  {
    name: 'SwampHacks X Feedback Form',
    dateModified: '01/01/2021',
    dateCreated: '01/01/2020',
    creator: 'Robert Conde',
  },
  {
    name: 'SwampHacks X Mentorship Form',
    dateModified: '01/01/2021',
    dateCreated: '01/01/2020',
    creator: 'Alexander Wang',
  },
  {
    name: 'SwampHacks X Volunteer Form',
    dateModified: '01/01/2021',
    dateCreated: '01/01/2020',
    creator: 'Shane Downs',
  },
  {
    name: 'SwampHacks X Sponsorship Form',
    dateModified: '01/01/2021',
    dateCreated: '01/01/2020',
    creator: 'Wilson Goins',
  },
];

export default function Forms() {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const competition = useContext(CompetitionContext);
  const rows = forms.map((form) => (
    <Table.Tr
      key={form.name}
      bg={
        selectedRows.includes(form.name)
          ? 'var(--mantine-color-blue-light)'
          : undefined
      }
    >
      <Table.Td>
        <Checkbox
          aria-label='Select row'
          checked={selectedRows.includes(form.name)}
          onChange={(event) =>
            setSelectedRows(
              event.currentTarget.checked
                ? [...selectedRows, form.name]
                : selectedRows.filter((name) => name !== form.name)
            )
          }
        />
      </Table.Td>
      <Table.Td>
        <a href='/forms/'>{form.name}</a>
      </Table.Td>
      <Table.Td>{form.dateModified}</Table.Td>
      <Table.Td>{form.dateCreated}</Table.Td>
      <Table.Td>
        <a href={`/admin/user/${form.creator}`}>{form.creator}</a>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div>
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
        <Button
          leftSection={<IconEdit size='1rem' />}
          radius='xl'
          onClick={(event) => {
            event.preventDefault();
            router.push(`${pathname}/create`);
          }}
        >
          Create Form
        </Button>
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
    </div>
  );
}
