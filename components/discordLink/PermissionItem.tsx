import { Group, List, Stack, Text } from '@mantine/core';
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconLineDashed,
} from '@tabler/icons-react';

interface Props {
  title: string;
  description: string;
  allowed: boolean;
}

export default function PermissionItem({ title, description, allowed }: Props) {
  return (
    <List.Item>
      <Group align='center' wrap='nowrap'>
        {allowed ? (
          <IconCircleCheckFilled color='green' />
        ) : (
          <IconCircleXFilled color='red' />
        )}

        <Stack gap={0}>
          {/* Mobile Permission */}
          <Text hiddenFrom='sm' size='sm' fw={500}>
            {title}
          </Text>
          {/* Desktop Permission */}
          <Text visibleFrom='sm' size='md' fw={500}>
            {title}
          </Text>

          {/* Mobile Description */}
          <Text hiddenFrom='sm' size='xs' c='dimmed'>
            {description}
          </Text>
          {/* Desktop Description */}
          <Text visibleFrom='sm' size='sm' c='dimmed'>
            {description}
          </Text>
        </Stack>
      </Group>
    </List.Item>
  );
}
