'use client';

import { DiscordLinkInfo } from '@/app/api/discord/[snowflake]/route';
import {
  Avatar,
  Button,
  Card,
  Container,
  Group,
  Image,
  List,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconCircleCheckFilled, IconLineDashed } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PermissionItem from './PermissionItem';
import { linkDiscord } from '@/actions/link';
import { getSession } from 'next-auth/react';
import { notifications } from '@mantine/notifications';

export default function DiscordLinkMain() {
  // States for page loading and data fetching
  const [loading, setLoading] = useState(true);
  const [discordInfo, setDiscordInfo] = useState<DiscordLinkInfo | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // State for button loading
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  const discordSnowflake = searchParams.get('snowflake');

  useEffect(() => {
    const fetchDiscordProfile = async () => {
      // No need to set error here, as separate page is shown
      if (!discordSnowflake) return;

      setLoading(true);

      try {
        const res = await fetch(`/api/discord/${discordSnowflake}`);

        // Handle errors
        if (res.status === 404) {
          setPageError('Discord profile not found');
          return;
        }

        if (res.status === 400) {
          setPageError('Invalid Discord snowflake or not provided');
          return;
        }

        if (res.status === 401) {
          setPageError(
            'Something went wrong on our end. Please try again later.'
          );
          return;
        }

        if (!res.ok) {
          setPageError('Error fetching Discord profile');
          return;
        }

        const data: DiscordLinkInfo = await res.json();

        console.log('DATA', data);
        setDiscordInfo(data);
      } catch (e) {
        setPageError('Error fetching Discord profile');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    console.log('Snowflake: ', discordSnowflake);
    fetchDiscordProfile();
  }, []);

  const onLinkDiscord = async () => {
    setButtonLoading(true);

    // Get id

    const user = await getSession();

    if (!user || !discordSnowflake) {
      notifications.show({
        title: 'Error linking Discord',
        message: 'No session or snowflake provided',
        color: 'red',
      });
      setButtonLoading(false);
      return;
    }

    console.log('User', user);

    try {
      const result = await linkDiscord(user.user.id, discordSnowflake);
    } catch (e) {
      notifications.show({
        title: 'Error linking Discord',
        message: 'An error occurred while linking your Discord account',
        color: 'red',
      });
      setButtonLoading(false);
    } finally {
      setButtonLoading(false);
    }
  };

  if (!discordSnowflake) {
    return (
      <Container h='100vh'>
        <Stack h='100%' justify='center' align='center' gap='xl'>
          <Image
            src='https://static.vecteezy.com/system/resources/thumbnails/036/333/732/small/black-and-white-cartoon-broken-robot-png.png'
            h={200}
            w={200}
          />
          <Stack gap={5}>
            <Title ta='center' order={1}>
              Invalid Link Format
            </Title>
            <Text ta='center'>
              Retry from the discord bot or contact a team member for
              assistance.
            </Text>
          </Stack>
        </Stack>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container h='100vh'>
        <Stack h='100%' justify='center' align='center' gap='xl'>
          <Group gap='xl'>
            <Skeleton width={120} height={120} circle />
            <Skeleton width={50} height={20} radius='md' />
            <Skeleton width={120} height={120} circle />
          </Group>
          <Stack gap='md' w='100%' align='center'>
            <Skeleton width='50%' height={40} radius='md' />
            <Skeleton width='50%' height={20} radius='md' />
          </Stack>
          <Group gap='xl' justify='center' w='100%'>
            <Skeleton width='20%' height={50} radius='md' />
            <Skeleton width='20%' height={50} radius='md' />
          </Group>
        </Stack>
      </Container>
    );
  }

  if (pageError) {
    return (
      <Container h='100vh'>
        <Stack h='100%' justify='center' align='center' gap='xl'>
          <Image
            src='https://static.vecteezy.com/system/resources/thumbnails/036/333/732/small/black-and-white-cartoon-broken-robot-png.png'
            h={200}
            w={200}
          />
          <Stack gap={5}>
            <Title ta='center' order={1}>
              Something went wrong...
            </Title>
            <Text ta='center'>{pageError}</Text>
          </Stack>
        </Stack>
      </Container>
    );
  }

  return (
    <Container h='100vh' px={{ base: 'xs', sm: 'xl' }}>
      <Stack h='100%' justify='center' align='center' gap='xl'>
        <Group gap='sm'>
          {/* Mobile Avatar */}
          <Avatar
            hiddenFrom='sm'
            src={discordInfo?.avatar}
            size={80}
            style={{ border: '2px solid gray' }}
          />
          {/* Tablet Avatar */}
          <Avatar
            visibleFrom='sm'
            hiddenFrom='md'
            src={discordInfo?.avatar}
            size={80}
            style={{ border: '2px solid gray' }}
          />
          {/* Desktop Avatar */}
          <Avatar
            visibleFrom='md'
            src={discordInfo?.avatar}
            size={100}
            style={{ border: '2px solid gray' }}
          />

          <Group gap={0}>
            {/* Mobile Icons */}
            <Group gap={0} hiddenFrom='sm'>
              <IconLineDashed color='gray' size={30} />
              <IconCircleCheckFilled size={30} color='green' />
              <IconLineDashed color='gray' size={30} />
            </Group>
            {/* Tablet Icons */}
            <Group gap={0} visibleFrom='sm' hiddenFrom='md'>
              <IconLineDashed color='gray' size={40} />
              <IconCircleCheckFilled size={30} color='green' />
              <IconLineDashed color='gray' size={40} />
            </Group>
            {/* Desktop Icons */}
            <Group gap={0} visibleFrom='md'>
              <IconLineDashed color='gray' size={50} />
              <IconCircleCheckFilled size={40} color='green' />
              <IconLineDashed color='gray' size={50} />
            </Group>
          </Group>

          {/* Mobile App Avatar */}
          <Avatar
            hiddenFrom='sm'
            src='/logos/swamphacks_hd.png'
            size={80}
            style={{ border: '2px solid gray' }}
            imageProps={{
              style: { objectFit: 'contain' },
            }}
          />
          {/* Tablet App Avatar */}
          <Avatar
            visibleFrom='sm'
            hiddenFrom='md'
            src='/logos/swamphacks_hd.png'
            size={80}
            style={{ border: '2px solid gray' }}
            imageProps={{
              style: { objectFit: 'contain' },
            }}
          />
          {/* Desktop App Avatar */}
          <Avatar
            visibleFrom='md'
            src='/logos/swamphacks_hd.png'
            size={100}
            style={{ border: '2px solid gray' }}
            imageProps={{
              style: { objectFit: 'contain' },
            }}
          />
        </Group>

        <Card
          shadow='md'
          w='100%'
          maw={{ base: '100%', sm: 500 }}
          p={{ base: 'md', sm: 'xl' }}
        >
          <Stack gap='lg' py='lg'>
            {/* Desktop Title */}
            <Text size='xl' fw={600} ta='center'>
              Connect with Discord
            </Text>

            {/* Mobile Description */}
            <Text hiddenFrom='sm' size='sm' c='dimmed' ta='center'>
              SwampHacks would like to connect to your Discord account
            </Text>
            {/* Desktop Description */}
            <Text visibleFrom='sm' size='md' c='dimmed' ta='center'>
              SwampHacks would like to connect to your Discord account
            </Text>

            <Card withBorder>
              {/* Mobile Header */}
              <Text hiddenFrom='sm' size='sm' fw={600} mb='sm'>
                This will allow SwampHacks to:
              </Text>
              {/* Desktop Header */}
              <Text visibleFrom='sm' size='md' fw={600} mb='sm'>
                This will allow SwampHacks to:
              </Text>

              <List spacing='sm'>
                <PermissionItem
                  title='Access Your Username'
                  description='Swamphacks will use your username to identify you.'
                  allowed
                />
                <PermissionItem
                  title='Change your roles'
                  description='Swamphacks will be able to change your roles in Discord.'
                  allowed
                />
                <PermissionItem
                  title='Cook you a nice meal'
                  description="I'm not really a good cook."
                  allowed={false}
                />
              </List>
            </Card>

            {/* Mobile Button */}
            <Button
              hiddenFrom='sm'
              size='md'
              bg={buttonLoading ? 'gray' : 'green'}
              onClick={onLinkDiscord}
              loading={buttonLoading}
              disabled={buttonLoading}
            >
              Connect with Discord
            </Button>
            {/* Desktop Button */}
            <Button
              visibleFrom='sm'
              size='lg'
              bg={buttonLoading ? 'gray' : 'green'}
              onClick={onLinkDiscord}
              loading={buttonLoading}
              disabled={buttonLoading}
            >
              Connect with Discord
            </Button>

            {/* Mobile Terms */}
            <Text hiddenFrom='sm' size='xs' c='dimmed' ta='center'>
              By connecting, you agree to our Terms of Service and Privacy
              Policy
            </Text>
            {/* Desktop Terms */}
            <Text visibleFrom='sm' size='sm' c='dimmed' ta='center'>
              By connecting, you agree to our Terms of Service and Privacy
              Policy
            </Text>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
