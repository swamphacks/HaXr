import { Container, Image, Stack, Text, Title } from '@mantine/core';

export default function SuccessPage() {
  return (
    <Container h='100vh'>
      <Stack h='100%' justify='center' align='center' gap='xl'>
        <Image
          src='https://i.pinimg.com/236x/bf/f5/d0/bff5d074d399bdfec6071e9168398406.jpg'
          h={200}
          w={200}
          alt='Success Silly Cat Picture'
        />
        <Stack gap={5} justify='center' align='center'>
          <Title ta='center' order={1}>
            You&apos;re all set! 🎉
          </Title>
          <Text ta='center' w={{ base: '100%', md: '60%' }}>
            Your discord account has now been linked to your account. Return to
            discord and go to #sync channel and sync your roles.
          </Text>
        </Stack>
      </Stack>
    </Container>
  );
}
