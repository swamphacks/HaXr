'use client';
import { setCompetitionDiscordId } from '@/actions/discord';
import {
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconBrandDiscord, IconBrandDiscordFilled } from '@tabler/icons-react';
import { useState } from 'react';

interface Props {
  discordId: string | null;
  code: string;
}

interface FormValues {
  discordId: string | null;
}

export default function SocialLinkConfiguration({ discordId, code }: Props) {
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({
    mode: 'uncontrolled',
    initialValues: {
      discordId: discordId,
    },
    validate: {
      discordId: (value) => {
        if (value === null || value === '') return null; // Allow null or empty values as valid

        if (isNaN(Number(value))) return 'Discord ID must be a number'; // Validate that the input is a number

        if (Number(value) < 0) return 'Discord ID cannot be negative'; // Ensure the value is non-negative

        if (Number(value) > 2 ** 64)
          return 'Discord ID must be valid snowflake'; // Validate length

        return null; // If all checks pass, return null (valid)
      },
    },
  });

  const onSubmit = async (value: FormValues) => {
    setLoading(true);
    const res = await setCompetitionDiscordId(code, value.discordId);

    if (!res) {
      notifications.show({
        title: 'Error',
        message: 'Failed to save role ID',
        color: 'red',
      });
      setLoading(false);
      return;
    }

    notifications.show({
      title: 'Success',
      message: 'Role ID saved. Refresh the page to see changes.',
      color: 'green',
    });
    setLoading(false);
  };

  return (
    <Container size={420} my={40}>
      <Paper shadow='md' radius='md' p='xl' withBorder>
        <Stack justify='center' align='center' gap='xl' w='100%'>
          <Stack justify='center' align='center' gap={0} w='100%'>
            <Title order={3} ta='center' mb='md'>
              Set Attendee Discord Role ID
            </Title>
            <Text ta='center'>
              You can find this by right-clicking the role in the discord server
              settings. It should be a number.
            </Text>
          </Stack>

          <form
            onSubmit={form.onSubmit(onSubmit)}
            style={{
              width: '100%',
            }}
          >
            <Stack justify='center' align='center' w='100%' gap={0}>
              <TextInput
                leftSection={<IconBrandDiscordFilled size={20} />}
                label='Discord Role ID'
                placeholder='Enter role ID'
                key={form.key('discordId')}
                {...form.getInputProps('discordId')}
                w='100%'
              />

              <Group justify='center' align='center' mt='md' w='100%'>
                <Button
                  loading={loading}
                  disabled={loading}
                  type='submit'
                  size='md'
                  radius='md'
                  fullWidth
                >
                  Save Role
                </Button>
              </Group>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
}
