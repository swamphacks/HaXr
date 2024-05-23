'use client';

import { useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, TextInput, rem } from '@mantine/core';
import { IconSearch, IconEdit } from '@tabler/icons-react';
import { Table, Checkbox } from '@mantine/core';
import { CompetitionContext } from '@/components/admin/AdminShell';
import { Form } from '@prisma/client';
import useSWR from 'swr';

// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Forms() {
	const router = useRouter();
	const pathname = usePathname();
	const [selectedRows, setSelectedRows] = useState<string[]>([]);
	const competition = useContext(CompetitionContext);

	const { data } = useSWR<Form[]>(`/api/comp/${competition.competition?.code}/forms`,
		fetcher, { fallbackData: [] });
	const rows = data?.map((form: Form) => (
		<Table.Tr
			key={form.title}
			bg={
				selectedRows.includes(form.title)
					? 'var(--mantine-color-blue-light)'
					: undefined
			}
		>
			<Table.Td>
				<Checkbox
					aria-label='Select row'
					checked={selectedRows.includes(form.title)}
					onChange={(event) =>
						setSelectedRows(
							event.currentTarget.checked
								? [...selectedRows, form.title]
								: selectedRows.filter((name) => name !== form.title)
						)
					}
				/>
			</Table.Td>
			<Table.Td>
				<a href='/forms/'>{form.title}</a>
			</Table.Td>
			<Table.Td>{form.update_at.toString()}</Table.Td>
			<Table.Td>{form.created_at.toString()}</Table.Td>
			<Table.Td>
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
