'use client';
import React from 'react';
import {
  AppShell,
  Burger,
  Divider,
  Group,
  Image,
  NavLink,
  ScrollArea,
  Select,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconCalendar,
  IconCoin,
  IconDoorEnter,
  IconEdit,
  IconExchange,
  IconInbox,
  IconInfoCircle,
  IconLego,
  IconQrcode,
  IconSettings,
  IconStatusChange,
  IconTicket,
} from '@tabler/icons-react';
import { UserButton } from '@clerk/nextjs';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding='md'
    >
      <AppShell.Header>
        <Group h='100%' px='md' justify='space-between'>
          <Group h='100%'>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom='sm'
              size='sm'
            />
            <Image
              src='logos/swamphacks_hd.png'
              mah={60}
              fit='contain'
              alt='SwampHacks logo'
              visibleFrom='sm'
            />
            <Title order={2}>Admin Portal</Title>
          </Group>

          <UserButton showName={true} />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p='md'>
        <Select
          placeholder='Select a competition'
          data={[
            {
              value: 'sh-x',
              label: 'SwampHacks X',
            },
          ]}
          defaultValue='sh-x'
          allowDeselect={false}
        />

        <Divider my='xs' />

        <AppShell.Section grow component={ScrollArea}>
          <NavLink
            label='Overview'
            leftSection={<IconInfoCircle size='1rem' />}
            active={true}
          />

          <NavLink
            label='Configuration'
            leftSection={<IconSettings size='1rem' />}
          />

          <NavLink label='Applications' leftSection={<IconInbox size='1rem' />}>
            <NavLink label='Edit Form' leftSection={<IconEdit size='1rem' />} />
            <NavLink
              label='Review'
              description='75% reviewed (57 remaining)'
              leftSection={<IconStatusChange size='1rem' />}
            />
          </NavLink>

          <NavLink
            label='Redeemables & Swag'
            leftSection={<IconCoin size='1rem' />}
          />

          <NavLink label='Events' leftSection={<IconCalendar size='1rem' />} />

          <NavLink label='Scanner' leftSection={<IconQrcode size='1rem' />}>
            <NavLink
              label='Check-in'
              description='17% checked-in (323 remaining)'
              leftSection={<IconDoorEnter size='1rem' />}
            />
            <NavLink label='Swag Shop' leftSection={<IconLego size='1rem' />} />
            <NavLink
              label='Event Attendance'
              leftSection={<IconTicket size='1rem' />}
            />
            <NavLink
              label='Item Loan'
              description={
                <Text inherit={true} c='red'>
                  2 items overdue
                </Text>
              }
              leftSection={<IconExchange size='1rem' />}
            />
          </NavLink>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
