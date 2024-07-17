import { Burger, Group, Modal, Tabs, Text, em, rem } from '@mantine/core';
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
import { useDisclosure, useMediaQuery } from '@mantine/hooks';

interface SettingsProps {
  opened: boolean;
}

export default function SettingsModal({ opened }: SettingsProps) {
  const iconStyle = { width: rem(20), height: rem(20) };
  const [burgerOpen, { toggle }] = useDisclosure();
  const isMobile = useMediaQuery(`(max-width: 50em)`);

  if (isMobile) {
    return (
      <Modal
        opened={opened}
        onClose={() => {}}
        fullScreen
        title={
          <Burger
            opened={burgerOpen}
            onClick={toggle}
            aria-label='Toggle navigation'
          />
        }
      >
        <Tabs orientation='vertical' defaultValue='public'>
          {burgerOpen ? (
            <Tabs.List className='h-full w-full justify-center align-middle'>
              <Tabs.Tab
                value='public'
                leftSection={<IconUser style={iconStyle} />}
                onClick={() => toggle()}
              >
                Public Profile
              </Tabs.Tab>

              <Tabs.Tab
                value='account'
                leftSection={<IconSettings style={iconStyle} />}
                onClick={() => toggle()}
              >
                Account
              </Tabs.Tab>

              <Tabs.Tab
                value='notifications'
                leftSection={<IconBellRinging style={iconStyle} />}
                onClick={() => toggle()}
              >
                Notifications
              </Tabs.Tab>

              <Tabs.Tab
                value='appearance'
                leftSection={<IconBrush style={iconStyle} />}
                onClick={() => toggle()}
              >
                Appearance
              </Tabs.Tab>
            </Tabs.List>
          ) : (
            <></>
          )}

          {burgerOpen ? (
            <></>
          ) : (
            <>
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
            </>
          )}
        </Tabs>
      </Modal>
    );
  }

  return (
    <Modal opened={opened} onClose={() => {}} size='xl'>
      <Tabs orientation='vertical' defaultValue='public'>
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
