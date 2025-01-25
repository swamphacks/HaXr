import { Container, Image, Stack, Text, Title } from '@mantine/core';

interface ErrorPageProps {
  errorMessage: string;
}

export default function ErrorPage({ errorMessage }: ErrorPageProps) {
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
            Something went wrong...
          </Title>
          <Text ta='center'>{errorMessage}</Text>
        </Stack>
      </Stack>
    </Container>
  );
}
