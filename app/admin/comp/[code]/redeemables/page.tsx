import { getRedeemables } from '@/actions/redeemable';
import RedeemableTable from '@/components/redeemables/RedeemableTable';
import { GetRedeemableOptions } from '@/types/redeemable';

interface Props {
	params: {
		code: string;
	};
}

export default async function Redeemables({ params: { code } }: Props) {
	const redeemables = await getRedeemables({
		competitionCode: code,
	} satisfies GetRedeemableOptions);
	return <RedeemableTable compCode={code} redeemables={redeemables} />;
}
