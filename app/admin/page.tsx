'use client';
import { ClerkLoaded, ClerkLoading, useUser } from '@clerk/nextjs';
import { Code, Space, Text } from '@mantine/core';

export default function Admin() {
  const { user } = useUser();
  return (
    <>
      You&apos;re an admin!
      <Space h='sm' />
      We know this because your public metadata is
      <Code>
        <ClerkLoading>Loading...</ClerkLoading>
        <ClerkLoaded>{JSON.stringify(user?.publicMetadata)}</ClerkLoaded>
      </Code>
      .
      <Space h='sm' />
      <ClerkLoaded>
        <Text
          c='red'
          hidden={user?.emailAddresses.some((e) =>
            e.emailAddress.endsWith('.edu')
          )}
        >
          Please add your .edu email address to your account profile! Click on
          your profile picture to edit your account information.
        </Text>
      </ClerkLoaded>
    </>
  );
}
