import { Modal, Tabs, em, rem } from '@mantine/core';
import {
  IconBellRinging,
  IconBrush,
  IconSettings,
  IconUser,
} from '@tabler/icons-react';
import React from 'react';
import PublicProfile from './tabs/PublicProfile';
import Account from './tabs/Account';
import Notifications from './tabs/Notifications';
import Appearance from './tabs/Appearance';
import { useMediaQuery } from '@mantine/hooks';

interface SettingsProps {
  opened: boolean;
}

export default function SettingsModal({ opened }: SettingsProps) {
  const iconStyle = { width: rem(20), height: rem(20) };
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  return (
    <Modal opened={opened} onClose={() => {}} size='xl'>
      <Tabs
        orientation={isMobile ? 'horizontal' : 'vertical'}
        defaultValue='public'
      >
        <Tabs.List>
          <Tabs.Tab value='public' leftSection={<IconUser style={iconStyle} />}>
            Public Profile
          </Tabs.Tab>

          <Tabs.Tab
            value='account'
            leftSection={<IconSettings style={iconStyle} />}
          >
            Account
          </Tabs.Tab>

          <Tabs.Tab
            value='notifications'
            leftSection={<IconBellRinging style={iconStyle} />}
          >
            Notifications
          </Tabs.Tab>

          <Tabs.Tab
            value='appearance'
            leftSection={<IconBrush style={iconStyle} />}
          >
            Appearance
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value='public'>
          <PublicProfile />
        </Tabs.Panel>

        <Tabs.Panel value='account'>
          <Account />
        </Tabs.Panel>

        <Tabs.Panel value='notifications'>
          <Notifications />
        </Tabs.Panel>

        <Tabs.Panel value='appearance'>
          <Appearance />
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
}
