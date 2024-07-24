import { Session } from 'next-auth';
import {
  Avatar,
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Stack,
  Text,
} from '@mantine/core';
import { IconLogout, IconSettings } from '@tabler/icons-react';
import { serverSignOut } from '@/actions/auth';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import SettingsModal from './settings/SettingsModal';

interface Props {
  session: Session;
}

export default function UserAvatar({ session }: Readonly<Props>) {
  const isMobile = useMediaQuery(`(max-width: 50em)`);
  const [settingsModalOpen, { open, close }] = useDisclosure();
  if (!session?.user) {
    console.log(session);
    console.log('NULL');
    return null;
  }

  const { image, firstName, lastName, email } = session.user;

  return (
    <Group justify='center'>
      <SettingsModal opened={settingsModalOpen} close={close} />
      <Menu trigger='click-hover' shadow='md' withArrow>
        <MenuTarget>
          <Avatar src={image} radius='xl' />
        </MenuTarget>
        <MenuDropdown>
          <MenuItem leftSection={<IconSettings />} onClick={open}>
            Settings
          </MenuItem>
          <MenuItem
            color='red'
            leftSection={<IconLogout />}
            onClick={async () => await serverSignOut()}
          >
            Sign-out
          </MenuItem>
        </MenuDropdown>
      </Menu>
      <Stack gap={5}>
        {isMobile ? (
          <></>
        ) : (
          <>
            <Text size='sm' fw={700} style={{ lineHeight: 1 }}>
              {firstName} {lastName}
            </Text>
            <Text c='dimmed' size='xs' style={{ lineHeight: 1 }}>
              {email}
            </Text>
          </>
        )}
      </Stack>
    </Group>
  );
}
