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
  Paper,
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
import InvalidLink from './InvalidLink';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorPage from './ErrorPage';
import DiscordAvatarGroup from './DiscordAvatarGroup';
import PermissionCard from './PermissionCard';
import SuccessPage from './SuccessPage';

export default function DiscordLinkMain() {
  // States for page loading and data fetching
  const [loading, setLoading] = useState(true);
  const [discordInfo, setDiscordInfo] = useState<DiscordLinkInfo | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
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
        setDiscordInfo(data);
      } catch (e) {
        setPageError('Error fetching Discord profile');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscordProfile();
  }, [discordSnowflake]);

  const onLinkDiscord = async () => {
    setButtonLoading(true);

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

    try {
      const result = await linkDiscord(user.user.id, discordSnowflake);

      setSuccess(true);
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

  if (!discordSnowflake) return <InvalidLink />;
  if (loading) return <LoadingSkeleton />;
  if (pageError) return <ErrorPage errorMessage={pageError} />;
  if (success) return <SuccessPage />;

  return (
    <Container h='100vh' px={{ base: 'xs', sm: 'xl' }}>
      <Stack h='100%' justify='center' align='center' gap='xl'>
        <DiscordAvatarGroup avatarUrl={discordInfo?.avatar} />
        <Paper withBorder radius='lg'>
          <Stack justify='center' align='center' gap='xl' p='xl'>
            <Text size='xl' fw={700}>
              Link With Discord
            </Text>
            <PermissionCard />
            <Button
              size='lg'
              bg={buttonLoading ? 'gray' : 'green'}
              onClick={onLinkDiscord}
              loading={buttonLoading}
              disabled={buttonLoading}
            >
              Connect with Discord
            </Button>
            <Text size='sm' c='dimmed' ta='center'>
              By connecting, you agree to our Terms of Service and Privacy
              Policy.
            </Text>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
