import { getEvents } from '@/actions/events';
import { getRedeemables } from '@/actions/redeemable';
import ScanEvents from '@/components/events/ScanEvents';

interface Props {
  params: {
    code: string;
  };
}

export default async function ScanEvent({ params: { code } }: Props) {
  return <ScanEvents events={await getEvents(code)} />;
}
