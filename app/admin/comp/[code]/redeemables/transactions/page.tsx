import { getTransactions } from '@/actions/redeemable';
import TransactionTable from '@/components/redeemables/TransactionTable';

interface Props {
  params: {
    code: string;
  };
}

export default async function Transaction({ params: { code } }: Props) {
  const transactions = await getTransactions(code);
  if (transactions === undefined) return <h1>Failed to fetch transactions</h1>;

  return <TransactionTable transactions={transactions} />;
}
