import {
  Burger,
  Drawer,
  Group,
  Modal,
  NavLink,
  Stack,
  Tabs,
  Text,
  Title,
  rem,
} from '@mantine/core';
import {
  Icon,
  IconBellRinging,
  IconProps,
  IconSettings,
} from '@tabler/icons-react';
import React, { useState } from 'react';
import Account from './tabs/Account';
import Notifications from './tabs/Notifications';
import Appearance from './tabs/Appearance';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';

interface SettingsProps {
  opened: boolean;
  closeModal: () => void;
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

export default function SettingsModal({ opened, closeModal }: SettingsProps) {
  const iconStyle = { width: rem(20), height: rem(20) };
  const isMobile = useMediaQuery(`(max-width: 50em)`);
  const [activeTab, setActiveTab] = useState('account');
  const [burgerOpen, { toggle, close: closeBurger }] = useDisclosure();

  const tabs: TabItem[] = [
    { value: 'account', label: 'Account', icon: IconSettings },
    { value: 'notifications', label: 'Notifications', icon: IconBellRinging },
    // { value: 'appearance', label: 'Appearance', icon: IconBrush },
  ];

  const tabPanels: TabPanelItem[] = [
    { value: 'account', component: Account },
    { value: 'notifications', component: Notifications },
    // { value: 'appearance', component: Appearance },
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
            closeBurger();
          }}
        />
      ))}
    </Stack>
  );

  return (
    <Modal
      opened={opened}
      onClose={() => {
        closeModal();
        setActiveTab('account');
      }}
      size='lg'
      fullScreen={isMobile}
      title={
        isMobile ? (
          <Group>
            <Burger
              opened={burgerOpen}
              onClick={toggle}
              aria-label='Toggle navigation'
            />
            <Title order={3}>
              {tabs.find((tab) => tab.value === activeTab)?.label}
            </Title>
          </Group>
        ) : (
          <Text>Settings</Text>
        )
      }
    >
      <Tabs orientation='vertical' value={activeTab}>
        {isMobile ? (
          <>
            <Drawer
              opened={burgerOpen}
              onClose={closeBurger}
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
