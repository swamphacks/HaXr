import { Divider, Stack, Text, Title } from '@mantine/core';
import React from 'react';

export default function Account() {
  return (
    <Stack w='100%' h='100%' pr={20} pl={20}>
      <Title order={2}>Account</Title>
      <Divider />
      <Text>This is where you manage your account.</Text>
    </Stack>
  );
}
