import { Container, Group, Skeleton, Stack } from '@mantine/core';

export default function LoadingSkeleton() {
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
