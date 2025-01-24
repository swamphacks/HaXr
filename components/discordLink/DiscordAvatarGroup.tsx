import { Avatar, Group } from '@mantine/core';
import { IconCircleCheckFilled, IconLineDashed } from '@tabler/icons-react';

interface DiscordAvatarGroupProps {
  avatarUrl?: string | null;
}

export default function DiscordAvatarGroup({
  avatarUrl,
}: DiscordAvatarGroupProps) {
  return (
    <Group gap='sm'>
      {/* Mobile Avatar */}
      <Avatar
        hiddenFrom='sm'
        src={avatarUrl}
        size={80}
        style={{ border: '2px solid gray' }}
      />
      {/* Tablet Avatar */}
      <Avatar
        visibleFrom='sm'
        hiddenFrom='md'
        src={avatarUrl}
        size={80}
        style={{ border: '2px solid gray' }}
      />
      {/* Desktop Avatar */}
      <Avatar
        visibleFrom='md'
        src={avatarUrl}
        size={100}
        style={{ border: '2px solid gray' }}
      />

      <Group gap={0}>
        {/* Mobile Icons */}
        <Group gap={0} hiddenFrom='sm'>
          <IconLineDashed color='gray' size={30} />
          <IconCircleCheckFilled size={30} color='green' />
          <IconLineDashed color='gray' size={30} />
        </Group>
        {/* Tablet Icons */}
        <Group gap={0} visibleFrom='sm' hiddenFrom='md'>
          <IconLineDashed color='gray' size={40} />
          <IconCircleCheckFilled size={30} color='green' />
          <IconLineDashed color='gray' size={40} />
        </Group>
        {/* Desktop Icons */}
        <Group gap={0} visibleFrom='md'>
          <IconLineDashed color='gray' size={50} />
          <IconCircleCheckFilled size={40} color='green' />
          <IconLineDashed color='gray' size={50} />
        </Group>
      </Group>

      {/* App Logo Avatar */}
      <Avatar
        src='/logos/swamphacks_hd.png'
        size={100}
        style={{ border: '2px solid gray' }}
        imageProps={{
          style: { objectFit: 'contain' },
        }}
      />
    </Group>
  );
}
