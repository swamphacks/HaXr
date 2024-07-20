import {
  Burger,
  Button,
  Drawer,
  Group,
  Modal,
  NavLink,
  Stack,
  Tabs,
  Text,
  Title,
  em,
  rem,
} from '@mantine/core';
import {
  Icon,
  IconBellRinging,
  IconBrush,
  IconProps,
  IconSettings,
  IconUser,
} from '@tabler/icons-react';
import React, { useState } from 'react';
import PublicProfile from './tabs/PublicProfile';
import Account from './tabs/Account';
import Notifications from './tabs/Notifications';
import Appearance from './tabs/Appearance';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';

interface SettingsProps {
  opened: boolean;
}

interface TabItem {
  value: string;
  label: string;
  icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>;
}

interface TabPanelItem {
  value: string;
  component: React.ComponentType;
}

export default function SettingsModal({ opened }: SettingsProps) {
  const iconStyle = { width: rem(20), height: rem(20) };
  const isMobile = useMediaQuery(`(max-width: 50em)`);
  const [activeTab, setActiveTab] = useState('public');
  const [burgerOpen, { toggle, open, close }] = useDisclosure();

  const tabs: TabItem[] = [
    { value: 'public', label: 'Public Profile', icon: IconUser },
    { value: 'account', label: 'Account', icon: IconSettings },
    { value: 'notifications', label: 'Notifications', icon: IconBellRinging },
    { value: 'appearance', label: 'Appearance', icon: IconBrush },
  ];

  const tabPanels: TabPanelItem[] = [
    { value: 'public', component: PublicProfile },
    { value: 'account', component: Account },
    { value: 'notifications', component: Notifications },
    { value: 'appearance', component: Appearance },
  ];

  const DesktopTabsList = () => (
    <Tabs.List>
      {tabs.map((tab) => (
        <Tabs.Tab
          key={tab.value}
          value={tab.value}
          leftSection={<tab.icon style={iconStyle} />}
          onClick={() => {
            setActiveTab(tab.value);
            close();
          }}
        >
          {tab.label}
        </Tabs.Tab>
      ))}
    </Tabs.List>
  );

  const MobileTabsList = () => (
    <Stack>
      {tabs.map((tab) => (
        <NavLink
          key={tab.label}
          label={tab.label}
          leftSection={<tab.icon style={iconStyle} />}
          active={activeTab === tab.value}
          onClick={() => {
            setActiveTab(tab.value);
            close();
          }}
        />
      ))}
    </Stack>
  );

  return (
    <Modal
      opened={opened}
      onClose={() => {}}
      size='lg'
      fullScreen={isMobile ? true : false}
      title={
        isMobile ? (
          <Burger
            opened={burgerOpen}
            onClick={toggle}
            aria-label='Toggle navigation'
          />
        ) : (
          <></>
        )
      }
    >
      <Tabs
        orientation='vertical'
        defaultValue='public'
        value={activeTab}
      >
        {isMobile ? (
          <>
            <Drawer
              opened={burgerOpen}
              onClose={close}
              title={<Text size='xl'>Settings</Text>}
            >
              <MobileTabsList />
            </Drawer>
          </>
        ) : (
          <DesktopTabsList />
        )}

        {tabPanels.map((panel) => (
          <Tabs.Panel value={panel.value} key={panel.value}>
            <panel.component />
          </Tabs.Panel>
        ))}
      </Tabs>
    </Modal>
  );
}
