'use client';
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  AppShellSection,
  Burger,
  Center,
  Divider,
  Group,
  Image,
  Loader,
  NavLink,
  ScrollArea,
  Select,
  Text,
  Title,
} from '@mantine/core';
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
import UserProfile from '@/components/UserAvatar';
import { Session } from 'next-auth';
import { useDisclosure } from '@mantine/hooks';
import { Competition } from '@prisma/client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Spinner from '../Spinner';
import useSWR from 'swr';
import superjson from 'superjson';

interface Props {
  session: Session;
  competitions: Competition[];
  code: string;
}

export default function AdminShell({
  session,
  competitions,
  code,
  children,
}: PropsWithChildren<Props>) {
  const [opened, { toggle }] = useDisclosure();
  const pathname = usePathname();

  const comp = competitions.find((c) => c.code === code)!;

  const safeCode = encodeURIComponent(code);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding='md'
    >
      <AppShellHeader>
        <Group h='100%' px='md' justify='space-between'>
          <Group h='100%'>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom='sm'
              size='sm'
            />

            <Image
              src='/logos/swamphacks_hd.png'
              mah={60}
              fit='contain'
              alt='SwampHacks logo'
              visibleFrom='sm'
            />
            <Title order={2}>{comp.name}</Title>
          </Group>

          <UserProfile session={session} />
        </Group>
      </AppShellHeader>

      <AppShellNavbar p='xs'>
        <AppShellSection grow component={ScrollArea}>
          <NavLink
            component={Link}
            label='Overview'
            leftSection={<IconInfoCircle size='1rem' />}
            href={`/admin/comp/${safeCode}`}
            active={pathname === `/admin/comp/${safeCode}`}
          />

          <NavLink
            component={Link}
            label='Configuration'
            leftSection={<IconSettings size='1rem' />}
            href={`/admin/comp/${safeCode}/configure`}
            active={pathname === `/admin/comp/${safeCode}/configure`}
          />

          <NavLink
            label='Applications'
            leftSection={<IconInbox size='1rem' />}
            defaultOpened={pathname.startsWith(`/admin/comp/${safeCode}/apps`)}
          >
            <NavLink
              component={Link}
              label='Edit Form'
              leftSection={<IconEdit size='1rem' />}
              href={`/admin/comp/${safeCode}/apps/edit-form`}
              active={pathname === `/admin/comp/${safeCode}/apps/edit-form`}
            />

            <NavLink
              component={Link}
              label='Review'
              description='75% reviewed (57 remaining)'
              leftSection={<IconStatusChange size='1rem' />}
              href={`/admin/comp/${safeCode}/apps`}
              active={pathname === `/admin/comp/${safeCode}/apps`}
            />
          </NavLink>

          <NavLink
            component={Link}
            label='Redeemables & Swag'
            leftSection={<IconCoin size='1rem' />}
            href={`/admin/comp/${safeCode}/redeemables`}
            active={pathname === `/admin/comp/${safeCode}/redeemables`}
          />

          <NavLink
            component={Link}
            label='Events'
            leftSection={<IconCalendar size='1rem' />}
            href={`/admin/comp/${safeCode}/events`}
            active={pathname === `/admin/comp/${safeCode}/events`}
          />

          <NavLink
            label='Scanner'
            leftSection={<IconQrcode size='1rem' />}
            defaultOpened={pathname.startsWith(`/admin/comp/${safeCode}/scan`)}
          >
            <NavLink
              component={Link}
              label='Check-in'
              description='17% checked-in (323 remaining)'
              leftSection={<IconDoorEnter size='1rem' />}
              href={`/admin/comp/${safeCode}/scan/check-in`}
              active={pathname === `/admin/comp/${safeCode}/scan/check-in`}
            />
            <NavLink
              component={Link}
              label='Swag Shop'
              leftSection={<IconLego size='1rem' />}
              href={`/admin/comp/${safeCode}/scan/swag`}
              active={pathname === `/admin/comp/${safeCode}/scan/swag`}
            />
            <NavLink
              component={Link}
              label='Event Attendance'
              leftSection={<IconTicket size='1rem' />}
              href={`/admin/comp/${safeCode}/scan/event`}
              active={pathname === `/admin/comp/${safeCode}/scan/event`}
            />
            <NavLink
              component={Link}
              label='Item Loan'
              description={
                <Text inherit={true} c='red'>
                  2 items overdue
                </Text>
              }
              leftSection={<IconExchange size='1rem' />}
              href={`/admin/comp/${safeCode}/scan/loan`}
              active={pathname === `/admin/comp/${safeCode}/scan/loan`}
            />
          </NavLink>

          <NavLink
            component={Link}
            label='Back to Dashboard'
            leftSection={<IconArrowLeft size='1rem' />}
            href='/admin'
            variant='subtle'
            color='red'
            active
          />
        </AppShellSection>
      </AppShellNavbar>

      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  );
}
