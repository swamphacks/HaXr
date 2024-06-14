import { Status } from '@prisma/client';
import { Badge } from '@mantine/core';

export const AppStatus: Record<Status, React.ReactNode> = {
  [Status.STARTED]: <Badge color='gray'>Started</Badge>,
  [Status.APPLIED]: <Badge color='blue'>Applied</Badge>,
  [Status.REJECTED]: <Badge color='orange'>Rejected</Badge>,
  [Status.WAITLISTED]: <Badge color='yellow'>Waitlisted</Badge>,
  [Status.ACCEPTED]: <Badge color='grape'>Accepted</Badge>,
  [Status.NOT_ATTENDING]: <Badge color='red'>Not Attending</Badge>,
  [Status.ATTENDING]: <Badge color='green'>Attending</Badge>,
};
