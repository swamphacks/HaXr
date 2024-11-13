import { Divider, Stack, Text, Title } from '@mantine/core';
import React from 'react';

export default function Notifications() {
  return (
    <Stack w='100%' h='100%' pr={20} pl={20}>
      <Title order={2}>Notifications (Coming soon)</Title>
      <Divider />
      <Text>Nothing to see here yet... stay tuned!</Text>
    </Stack>
  );
}
