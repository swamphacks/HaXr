import { getEventsWithInfo } from '@/actions/events';
import EventsTable from '@/components/events/EventsTable';

interface Props {
  params: {
    code: string;
  };
}

export default async function Events({ params: { code } }: Props) {
  return (
    <EventsTable
      compCode={code}
      eventsWithInfo={await getEventsWithInfo(code)}
    />
  );
}
