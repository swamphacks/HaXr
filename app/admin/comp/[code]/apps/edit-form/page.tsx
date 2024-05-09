'use client';

import Link from 'next/link';
import { useState } from 'react';
import { NavLink, TextInput, rem, useMantineTheme } from '@mantine/core';
import { IconSearch, IconEdit } from '@tabler/icons-react';
import { Table, Checkbox } from '@mantine/core';
import './page.css';

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

export default function EditForm() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
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
      <Table.Td>{form.name}</Table.Td>
      <Table.Td>{form.dateModified}</Table.Td>
      <Table.Td>{form.dateCreated}</Table.Td>
      <Table.Td>{form.creator}</Table.Td>
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
        <NavLink
          component={Link}
          label='Create Form'
          leftSection={<IconEdit size='1rem' />}
          styles={{
            root: {
              width: 'fit-content',
              borderRadius: rem(20),
            },
          }}
          href='/admin/comp/edit-form/create'
        />
      </div>
      <div className='mb-2 grid grid-cols-[auto_40%]'>
        <div className='self-center text-[1.4rem]'>Recent Forms</div>
      </div>
      <Table>
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
