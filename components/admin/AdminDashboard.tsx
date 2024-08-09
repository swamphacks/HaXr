'use client';
import {
  Box,
  Button,
  Center,
  Combobox,
  Stack,
  Text,
  Title,
  useCombobox,
} from '@mantine/core';
import {
  IconDoorExit,
  IconLink,
  IconSettings,
  IconTrophy,
} from '@tabler/icons-react';
import { serverSignOut } from '@/actions/auth';
import { AdminLink, Competition } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Props {
  links: AdminLink[];
  competitions: Competition[];
}

export default function AdminDashboard({ links, competitions }: Props) {
  const combobox = useCombobox();
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <Center mx='auto' my='sm' maw={500}>
      <Stack w='100%' m='sm' gap='xs'>
        <Center>
          <Title m={0} p={0} order={2}>
            <b>
              <u>Admin Dashboard</u>
            </b>
          </Title>
        </Center>

        {links.map(({ id, name, url }) => (
          <Button
            key={id}
            fullWidth
            size='lg'
            leftSection={<IconLink />}
            component='a'
            href={url}
          >
            {name}
          </Button>
        ))}

        <Combobox store={combobox} withArrow>
          <Combobox.Target>
            <Button
              size='lg'
              color='yellow'
              leftSection={<IconTrophy />}
              onClick={() => combobox.toggleDropdown()}
            >
              Competitions
            </Button>
          </Combobox.Target>

          <Combobox.Dropdown>
            <Combobox.Options>
              {competitions.map(({ name, code }) => (
                <Combobox.Option
                  key={code}
                  value={code}
                  onClick={() =>
                    router.push(`/admin/comp/${encodeURIComponent(code)}`)
                  }
                >
                  {name}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>

        <Button
          fullWidth
          size='lg'
          color='red'
          variant='outline'
          leftSection={<IconDoorExit />}
          onClick={serverSignOut}
        >
          Sign-out
        </Button>
      </Stack>
    </Center>
  );
}
