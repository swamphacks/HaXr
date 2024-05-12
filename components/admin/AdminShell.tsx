'use client';
import React, {
  createContext,
  PropsWithChildren,
  useState,
  useEffect,
} from 'react';
import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  AppShellSection,
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
import useSWR from 'swr';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  session: Session;
}

export const CompetitionContext = createContext<{ competition?: Competition }>({
  competition: undefined,
});

// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function AdminShell({
  session,
  children,
}: PropsWithChildren<Props>) {
  const [opened, { toggle }] = useDisclosure();
  const pathname = usePathname();
  const [comp, setComp] = useState<string | null>(null);

  const { data } = useSWR<Competition[]>('/api/comp', fetcher, {
    fallbackData: [],
  });

  useEffect(() => {
    const selectedComp = sessionStorage.getItem('selectedComp');

    // Check if the selected competition still exists
    if (selectedComp && data?.find((c) => c.code === selectedComp)) {
      setComp(selectedComp);
    }
  }, [data]);

  return (
    <CompetitionContext.Provider
      value={{ competition: data?.find((c) => c.code === comp) }}
    >
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
                src='logos/swamphacks_hd.png'
                mah={60}
                fit='contain'
                alt='SwampHacks logo'
                visibleFrom='sm'
              />
              <Title order={2}>Admin Portal</Title>
            </Group>

            <UserProfile session={session} />
          </Group>
        </AppShellHeader>

        <AppShellNavbar p='md'>
          <Select
            placeholder='Select a competition'
            data={data?.map((c) => ({ value: c.code, label: c.name }))}
            value={comp}
            onChange={(comp) => {
              setComp(comp);

              if (comp) {
                sessionStorage.setItem('selectedComp', comp);
              } else {
                sessionStorage.removeItem('selectedComp');
              }
            }}
            allowDeselect={true}
          />

          <div hidden={!comp}>
            <Divider my='xs' />

            <AppShellSection grow component={ScrollArea}>
              <NavLink
                component={Link}
                label='Overview'
                leftSection={<IconInfoCircle size='1rem' />}
                href='/admin/comp'
                active={pathname === '/admin/comp'}
              />

              <NavLink
                component={Link}
                label='Configuration'
                leftSection={<IconSettings size='1rem' />}
                href='/admin/comp/configure'
                active={pathname === '/admin/comp/configure'}
              />

              <NavLink
                label='Applications'
                leftSection={<IconInbox size='1rem' />}
                defaultOpened={pathname.startsWith('/admin/comp/apps')}
              >
                <NavLink
                  component={Link}
                  label='Edit Form'
                  leftSection={<IconEdit size='1rem' />}
                  href='/admin/comp/apps/edit-form'
                  active={pathname === '/admin/comp/apps/edit-form'}
                />

                <NavLink
                  component={Link}
                  label='Review'
                  description='75% reviewed (57 remaining)'
                  leftSection={<IconStatusChange size='1rem' />}
                  href='/admin/comp/apps'
                  active={pathname === '/admin/comp/apps'}
                />
              </NavLink>

              <NavLink
                component={Link}
                label='Redeemables & Swag'
                leftSection={<IconCoin size='1rem' />}
                href='/admin/comp/redeemables'
                active={pathname === '/admin/comp/redeemables'}
              />

              <NavLink
                component={Link}
                label='Events'
                leftSection={<IconCalendar size='1rem' />}
                href='/admin/comp/events'
                active={pathname === '/admin/comp/events'}
              />

              <NavLink
                label='Scanner'
                leftSection={<IconQrcode size='1rem' />}
                defaultOpened={pathname.startsWith('/admin/comp/scan')}
              >
                <NavLink
                  component={Link}
                  label='Check-in'
                  description='17% checked-in (323 remaining)'
                  leftSection={<IconDoorEnter size='1rem' />}
                  href='/admin/comp/scan/check-in'
                  active={pathname === '/admin/comp/scan/check-in'}
                />
                <NavLink
                  component={Link}
                  label='Swag Shop'
                  leftSection={<IconLego size='1rem' />}
                  href='/admin/comp/scan/swag'
                  active={pathname === '/admin/comp/scan/swag'}
                />
                <NavLink
                  component={Link}
                  label='Event Attendance'
                  leftSection={<IconTicket size='1rem' />}
                  href='/admin/comp/scan/event'
                  active={pathname === '/admin/comp/scan/event'}
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
                  href='/admin/comp/scan/loan'
                  active={pathname === '/admin/comp/scan/loan'}
                />
              </NavLink>
            </AppShellSection>
          </div>
        </AppShellNavbar>

        <AppShellMain>{children}</AppShellMain>
      </AppShell>
    </CompetitionContext.Provider>
  );
}
