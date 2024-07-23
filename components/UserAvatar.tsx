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
import { IconLogout } from '@tabler/icons-react';
import { serverSignOut } from '@/actions/auth';
import { useMediaQuery } from '@mantine/hooks';

interface Props {
  session: Session;
}

export default function UserAvatar({ session }: Readonly<Props>) {
  const isMobile = useMediaQuery(`(max-width: 50em)`);
  if (!session?.user) {
    console.log(session);
    console.log('NULL');
    return null;
  }

  const { image, name, email } = session.user;

  return (
    <Group justify='center'>
      <Menu trigger='click-hover' shadow='md' withArrow>
        <MenuTarget>
          <Avatar src={image} radius='xl' />
        </MenuTarget>
        <MenuDropdown>
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
        <Text size='sm' fw={700} style={{ lineHeight: 1 }}>
          {name}
        </Text>
        {isMobile ? (
          <></>
        ) : (
          <Text c='dimmed' size='xs' style={{ lineHeight: 1 }}>
            {email}
          </Text>
        )}
      </Stack>
    </Group>
  );
}
