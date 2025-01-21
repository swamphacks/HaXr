import { Check, CheckType, SingleCheck } from '@/types/scanning';
import { List, ThemeIcon } from '@mantine/core';
import {
  IconCircleCheck,
  IconCircleDashed,
  IconInfoCircle,
  IconListCheck,
} from '@tabler/icons-react';
import { ReactNode } from 'react';

interface Props {
  checks: Check[];
}

const getCheckIcon = (check: Check): ReactNode => {
  if (check.type === CheckType.Automated) {
    return (
      <ThemeIcon color={check.complete ? 'green' : 'red'} size={24} radius='xl'>
        <IconCircleCheck size={16} />
      </ThemeIcon>
    );
  } else if (check.type === CheckType.Manual) {
    return (
      <ThemeIcon color='gray' size={24} radius='xl'>
        <IconCircleDashed size={16} />
      </ThemeIcon>
    );
  } else if (check.type === CheckType.Info) {
    return (
      <ThemeIcon color='blue' size={24} radius='xl'>
        <IconInfoCircle size={16} />
      </ThemeIcon>
    );
  } else if (check.type === CheckType.Dependent) {
    return (
      <ThemeIcon
        color={
          check.dependsOn
            .filter((c) => c.type === CheckType.Automated && c.required)
            .every((c) => 'complete' in c && c.complete!)
            ? 'green'
            : 'red'
        }
        size={24}
        radius='xl'
      >
        <IconListCheck size={16} />
      </ThemeIcon>
    );
  }
};

const renderSingleCheck = (c: SingleCheck) => {
  // TODO: specify actual unique key
  if ('required' in c) {
    if (!c.required) {
      return (
        <List.Item key={c.name} icon={getCheckIcon(c)}>
          <b>(Optional)</b> {c.name}
        </List.Item>
      );
    }
  }
  return (
    <List.Item key={c.name} icon={getCheckIcon(c)}>
      {c.name}
    </List.Item>
  );
};

export default function CheckInChecks({ checks }: Props) {
  return (
    <List spacing='xs' size='sm' center m='xs'>
      {checks.map((c) => {
        if (c.type === CheckType.Dependent) {
          return (
            <>
              <List.Item icon={getCheckIcon(c)}>{c.name}</List.Item>
              <List.Item>
                <List withPadding size='sm'>
                  {c.dependsOn.map(renderSingleCheck)}
                </List>
              </List.Item>
            </>
          );
        }
        return renderSingleCheck(c);
      })}
    </List>
  );
}
