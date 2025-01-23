'use client';

import { useMemo, useState } from 'react';
import {
	createRedeemable,
	updateRedeemable,
	deleteRedeemable,
} from '@/actions/redeemable';
import { Flex, Button, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Redeemable } from '@prisma/client';
import { modals } from '@mantine/modals';
import { CreateRedeemableBody } from '@/types/redeemable';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import {
	MantineReactTable,
	useMantineReactTable,
	type MRT_ColumnDef,
	type MRT_TableOptions,
	type MRT_Row,
} from 'mantine-react-table';

type RedeemableColumn = Omit<Redeemable, 'createdAt'> & { createdAt: string };

interface Props {
	compCode: string;
	redeemables: Redeemable[];
}

export default function RedeemableTable({ compCode, redeemables }: Props) {
	const [validationErrors, setValidationErrors] = useState<
		Record<string, string | undefined>
	>({});

	const columns = useMemo<MRT_ColumnDef<RedeemableColumn>[]>(
		() => [
			{
				header: 'Name',
				accessorKey: 'name',
				enableEditing: true,
				mantineEditTextInputProps: ({ cell, row }) => ({
					type: 'email',
					required: true,
				}),
			},
			{
				header: 'Description',
				accessorKey: 'description',
				enableEditing: true,
			},
			{
				header: 'Created At',
				accessorKey: 'createdAt',
				enableEditing: false,
			},
		],
		[]
	);

	const [data, setData] = useState<RedeemableColumn[]>(() =>
		redeemables.map((r) => ({
			...r,
			createdAt: new Date(r.createdAt).toDateString(),
		}))
	);

	const handleSaveRow: MRT_TableOptions<RedeemableColumn>['onEditingRowSave'] =
		async ({ table, row, values }) => {
			try {
				const resp = await updateRedeemable(compCode, data[row.index].name, {
					name: values.name,
					description: values.description,
				});
				if (resp.status === 204) {
					console.log(resp);
					data[row.index] = values;
					setData([...data]);
					table.setEditingRow(null);
					notifications.show({
						color: 'green',
						title: 'Success!',
						message: 'Redeemable updated successfully.',
					});
				} else {
					notifications.show({
						color: 'red',
						title: 'Error updating redeemable',
						message: resp.statusText,
					});
				}
			} catch (e) {
				notifications.show({
					color: 'red',
					title: 'Error updating redeemable',
					message: e instanceof Error ? e.message : 'Unknown error. Check logs.',
				});
				console.error('error', e);
			}
		};

	const handleCreateRow: MRT_TableOptions<RedeemableColumn>['onCreatingRowSave'] =
		async ({ values, exitCreatingMode }) => {
			try {
				delete values.createdAt;
				const request: CreateRedeemableBody = {
					...values,
					competitionCode: compCode,
				};
				const resp = await createRedeemable(request);
				if (!resp.data) {
					notifications.show({
						color: 'red',
						title: 'Error creating redeemable',
						message: resp.statusText,
					});
				} else {
					const transformed = {
						...resp.data,
						createdAt: new Date(resp.data.createdAt).toDateString(),
					};
					setData([...data, transformed]);
					exitCreatingMode();
					notifications.show({
						color: 'green',
						title: 'Success!',
						message: 'Redeemable created successfully.',
					});
				}
			} catch (e) {
				console.error('error', e);
				notifications.show({
					color: 'red',
					title: 'An unknown error occurred.',
					message: 'Check console for more info.',
				});
			}
			exitCreatingMode();
		};

	const openDeleteConfirmModal = (row: MRT_Row<RedeemableColumn>) => {
		return modals.openConfirmModal({
			title: 'Are you sure you want to delete this redeemable?',
			children: (
				<Text>
					Are you sure you want to delete <span className="underline text-red-300">{row.original.name}</span>? This action{' '}
					<span className="font-bold">cannot</span> be undone.
				</Text>
			),
			labels: { confirm: 'Delete', cancel: 'Cancel' },
			confirmProps: { color: 'red' },
			onConfirm: async () => {
				try {
					const resp = await deleteRedeemable(
						row.original.competitionCode,
						row.original.name
					);
					if (resp.status === 204) {
						const newData = [...data];
						newData.splice(row.index, 1);
						setData(newData);
						notifications.show({
							color: 'green',
							title: 'Success!',
							message: 'Redeemable deleted successfully.',
						});
					}
				} catch (e) {
					console.error(e);
					notifications.show({
						color: 'red',
						title: 'Error deleting redeemable',
						message: e instanceof Error ? e.message : 'Unknown error. Check logs.',
					});
				}
			},
		});
	};

	const table = useMantineReactTable({
		columns,
		data,
		enableEditing: true,
		editDisplayMode: 'modal',
		createDisplayMode: 'modal',
		enableRowActions: true,
		onEditingRowSave: handleSaveRow,
		onCreatingRowSave: handleCreateRow,
		renderTopToolbarCustomActions: ({ table }) => (
			<Button
				styles={{
					root: {
						'--button-padding-x': '12px',
					}
				}}
				variant="light" onClick={() => table.setCreatingRow(true)}>
				Create
			</Button>
		),
		renderRowActions: ({ row, table }) => (
			<Flex gap="sm">
				<Button color="yellow" styles={{ root: { '--button-padding-x': '3px', '--button-height': '32px' } }} onClick={() => table.setEditingRow(row)}><IconEdit color="white" /></Button>
				<Button color="red" styles={{ root: { '--button-padding-x': '3px', '--button-height': '32px' } }} onClick={() => openDeleteConfirmModal(row)}><IconTrash color="white" /></Button>
			</Flex>
		),
	});

	return <MantineReactTable table={table} />;
}
