'use client';

import { useMemo, useState } from 'react';
import {
	MantineReactTable,
	useMantineReactTable,
	type MRT_ColumnDef,
	type MRT_TableOptions,
} from 'mantine-react-table';
import { createRedeemable, updateRedeemable } from '@/actions/redeemable';
import { Button } from '@mantine/core';
import { Redeemable } from '@prisma/client';
import { CreateRedeemableBody } from '@/types/redeemable';

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
				const resp = await updateRedeemable(compCode, data[row.index].name, { name: values.name, description: values.description });
				if (resp.status === 204) {
					console.log(resp);
					data[row.index] = values;
					setData([...data]);
					table.setEditingRow(null);
				} else alert(resp.statusText);

			} catch (e) {
				alert('An unknown error occurred. Check logs.');
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
				}
				const resp = await createRedeemable(request);
				if (!resp.data) {
					alert(resp.statusText);
					setValidationErrors({
						...validationErrors,
						name: resp.statusText,
					});
				} else {
					const transformed = { ...resp.data, createdAt: new Date(resp.data.createdAt).toDateString() };
					setData([...data, transformed]);
					alert('Success! Redeemable created.');
				}
			} catch (e) {
				console.error('error', e);
				setValidationErrors((prev) => ({
					...prev,
					name: 'An unknown error occurred',
				}));

			}
			exitCreatingMode();
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
			<Button onClick={() => table.setCreatingRow(true)}>
				Create Redeemable
			</Button>
		),
	});

	return <MantineReactTable table={table} />;
}
