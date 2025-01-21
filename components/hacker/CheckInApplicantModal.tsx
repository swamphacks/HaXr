import {
  Modal,
  Stack,
  Alert,
  Center,
  Paper,
  LoadingOverlay,
  Button,
  Box,
  Skeleton,
} from '@mantine/core';
import { useRouter } from 'next/navigation';
import QRCode from 'react-qr-code';
import CheckInChecks from '../checkin/CheckInChecks';
import { CompetitionWithApplication } from '@/actions/applications';
import useSWR from 'swr';
import { getCheckInChecks } from '@/actions/scanning';
import {
  Icon123,
  IconCheckbox,
  IconError404,
  IconListCheck,
  IconRefresh,
  IconX,
} from '@tabler/icons-react';

interface Props {
  opened: boolean;
  close: () => void;
  competition: CompetitionWithApplication | null;
}

export default function CheckInApplicantModal({
  opened,
  close,
  competition,
}: Props) {
  const router = useRouter();
  const {
    error,
    data: checks,
    isLoading,
    isValidating,
    mutate,
  } = useSWR(opened && 'check-in-checks', () =>
    getCheckInChecks(competition?.application?.id || '')
  );

  if (!competition) return null;
  const { name, application } = competition;

  return (
    <Modal
      title={<b>Check-in to {name}</b>}
      opened={opened}
      onClose={() => {
        close();
        router.refresh();
      }}
    >
      <Stack>
        <Box pos='relative'>
          {!isLoading && (error || !checks) && (
            <Alert
              title='Pre-checks'
              variant='light'
              color='red'
              icon={<IconX />}
            >
              There was an error loading the pre-checks. Please try again.
            </Alert>
          )}

          {!error && (
            <Alert
              title='Pre-checks'
              variant='light'
              color='gray'
              icon={<IconListCheck />}
            >
              {checks ? (
                <>
                  <CheckInChecks checks={checks} />
                  <Button
                    leftSection={<IconRefresh />}
                    onClick={() => mutate()}
                    loading={isValidating}
                    fullWidth
                    mt='md'
                    color='yellow'
                  >
                    Refresh Checks
                  </Button>
                </>
              ) : (
                <>
                  <Skeleton height={8} mt={8} radius='sm' />
                  <Skeleton height={8} mt={8} radius='sm' />
                  <Skeleton height={8} mt={8} radius='sm' />
                  <Skeleton height={8} mt={8} radius='sm' />
                  <Skeleton height={8} mt={8} radius='sm' />
                  <Skeleton height={8} mt={8} radius='sm' />
                  <Skeleton height={8} mt={8} radius='sm' />
                  <Skeleton height={8} mt={8} radius='sm' />
                </>
              )}
            </Alert>
          )}
        </Box>

        <Center>
          <Paper p='sm' bg='white' shadow='xl' radius='md'>
            {application && <QRCode value={application.userId} size={256} />}
          </Paper>
        </Center>
      </Stack>
    </Modal>
  );
}
