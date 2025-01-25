import { Container, Image, Stack, Text, Title } from '@mantine/core';

export default function InvalidLink() {
  return (
    <Container h='100vh'>
      <Stack h='100%' justify='center' align='center' gap='xl'>
        <Image
          src='https://static.vecteezy.com/system/resources/thumbnails/036/333/732/small/black-and-white-cartoon-broken-robot-png.png'
          h={200}
          w={200}
          alt='Error illustration'
        />
        <Stack gap={5}>
          <Title ta='center' order={1}>
            Invalid Link Format
          </Title>
          <Text ta='center'>
            Retry from the discord bot or contact a team member for assistance.
          </Text>
        </Stack>
      </Stack>
    </Container>
  );
}
