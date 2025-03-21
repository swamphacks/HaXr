'use client';
import React, { PropsWithChildren } from 'react';
import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  AppShellSection,
  Burger,
  Group,
  Image,
  NavLink,
  ScrollArea,
  Title,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconCashRegister,
  IconCalendar,
  IconCoin,
  IconDoorEnter,
  IconEdit,
  IconInbox,
  IconInfoCircle,
  IconLego,
  IconQrcode,
  IconSettings,
  IconSocial,
  IconStatusChange,
  IconTicket,
  IconCheck,
  IconForms,
  IconClipboardCheck,
} from '@tabler/icons-react';
import UserAvatar from '@/components/UserAvatar';
import { Session } from 'next-auth';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CompetitionWithStats } from '@/actions/competition';

interface Props {
  session: Session;
  competitions: CompetitionWithStats[];
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
  const percentAppsReviewed = Math.round(
    ((comp.stats.total - comp.stats.remaining) / comp.stats.total) * 100
  );

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

          <UserAvatar session={session} />
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
            label='Configuration'
            leftSection={<IconSettings size='1rem' />}
            defaultOpened={pathname.startsWith(
              `/admin/comp/${safeCode}/configure`
            )}
          >
            <NavLink
              component={Link}
              label='General'
              leftSection={<IconSettings size='1rem' />}
              href={`/admin/comp/${safeCode}/configure/general`}
              active={pathname === `/admin/comp/${safeCode}/configure/general`}
            />

            <NavLink
              component={Link}
              label='Social Links'
              leftSection={<IconSocial size='1rem' />}
              href={`/admin/comp/${safeCode}/configure/social-links`}
              active={
                pathname === `/admin/comp/${safeCode}/configure/social-links`
              }
            />
          </NavLink>

          <NavLink
            label='Applications'
            leftSection={<IconInbox size='1rem' />}
            defaultOpened={pathname.startsWith(`/admin/comp/${safeCode}/apps`)}
          >
            <NavLink
              component={Link}
              label='Review'
              description={`${percentAppsReviewed}% reviewed (${comp.stats.remaining} remaining)`}
              leftSection={<IconStatusChange size='1rem' />}
              href={`/admin/comp/${safeCode}/apps`}
              active={pathname === `/admin/comp/${safeCode}/apps`}
            />

            <NavLink
              component={Link}
              label='Form Status'
              leftSection={<IconClipboardCheck size='1rem' />}
              href={`/admin/comp/${safeCode}/apps/form-status`}
              active={pathname === `/admin/comp/${safeCode}/apps/form-status`}
            />
          </NavLink>

          <NavLink
            label='Redeemables'
            leftSection={<IconCoin size='1rem' />}
            defaultOpened={pathname.startsWith(
              `/admin/comp/${safeCode}/redeemables`
            )}
          >
            <NavLink
              component={Link}
              label='Manage Redeemables'
              leftSection={<IconLego size='1rem' />}
              href={`/admin/comp/${safeCode}/redeemables/manage`}
              active={pathname === `/admin/comp/${safeCode}/redeemables/manage`}
            />
            <NavLink
              component={Link}
              label='Transactions'
              leftSection={<IconCashRegister size='1rem' />}
              href={`/admin/comp/${safeCode}/redeemables/transactions`}
              active={
                pathname === `/admin/comp/${safeCode}/redeemables/transactions`
              }
            />
          </NavLink>

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
              // description='17% checked-in (323 remaining)'
              leftSection={<IconDoorEnter size='1rem' />}
              href={`/admin/comp/${safeCode}/scan/check-in`}
              active={pathname === `/admin/comp/${safeCode}/scan/check-in`}
            />
            <NavLink
              component={Link}
              label='Redeemables'
              leftSection={<IconLego size='1rem' />}
              href={`/admin/comp/${safeCode}/scan/redeemables`}
              active={pathname === `/admin/comp/${safeCode}/scan/swag`}
            />
            <NavLink
              component={Link}
              label='Event Attendance'
              leftSection={<IconTicket size='1rem' />}
              href={`/admin/comp/${safeCode}/scan/event`}
              active={pathname === `/admin/comp/${safeCode}/scan/event`}
            />
            {/* <NavLink
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
            /> */}
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
