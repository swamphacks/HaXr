import { getAttendees } from '@/actions/applications';
import { getRedeemables } from '@/actions/redeemable';
import { Redeemable } from '@prisma/client';
import { Text } from '@mantine/core';
import ScanRedeemable from '@/components/redeemables/ScanRedeemable';

interface Props {
	params: {
		code: string;
	};
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ScanRedeemables({ params, searchParams }: Props) {
	const [attendees, redeemables, search] = await Promise.all([
		await getAttendees(params.code, { user: true }),
		await getRedeemables({ competitionCode: params.code }),
		await searchParams
	]);

	const name = Array.isArray(search.name) ? search.name.at(0) : search.name;

	if (!attendees.data) return <Text>{attendees.statusText}</Text>;

	return (
		<ScanRedeemable
			compCode={params.code}
			attendees={attendees.data}
			redeemables={redeemables}
			name={Array.isArray(name) ? name.at(0) : name}
		/>
	);
}
