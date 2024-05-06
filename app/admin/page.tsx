import { Code, Space, Text } from '@mantine/core';
import { auth } from '@/auth';

export default async function Admin() {
  const { user } = (await auth())!;

  return (
    <>
      You&apos;re an admin!
      <Space h='sm' />
      We know this because <Code>session.user</Code> has{' '}
      <Code>role: {user?.role}</Code>
      <Text c='red' hidden={user?.email?.endsWith('.edu')}>
        Please add your .edu email address to your account profile! Click on
        your profile picture to edit your account information.
      </Text>
    </>
  );
}
