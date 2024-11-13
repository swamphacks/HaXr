'use client';
import InformationStep from '@/components/onboarding/InformationStep';
import Introduction from '@/components/onboarding/Introduction';
import {
  Button,
  Container,
  Group,
  Progress,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useState } from 'react';

export default function Onboarding() {
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 5 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 1 ? current - 1 : current));

  const renderContent = () => {
    switch (active) {
      case 0:
        return <InformationStep />;
      case 1:
        return <InformationStep />;
      case 2:
        return <InformationStep />;
      case 3:
        return <InformationStep />;
      case 4:
        return <InformationStep />;
      case 5:
        return <InformationStep />;
      default:
        return <InformationStep />;
    }
  };

  return (
    <Stack w='100vw' h='100vh' align='center' justify='center'>
      <Stack h='80%' w='60%' justify='space-between' align='center'>
        <Group w='70%' justify='center' wrap='nowrap'>
          <UnstyledButton onClick={prevStep}>
            <Group wrap='nowrap' gap={3} align='center' justify='center'>
              <Text c='gray.6'>Back</Text>
            </Group>
          </UnstyledButton>
          <Progress value={(active / 5) * 100} w='90%' />
          <Text>{active}/5</Text>
        </Group>
        <Container>{renderContent()}</Container>
        <Group w='100%' align='center' justify='center'>
          {active < 5 ? (
            <Button w='18%' onClick={nextStep}>
              Save and Continue
            </Button>
          ) : (
            <Button w='18%' onClick={nextStep}>
              Submit
            </Button>
          )}
        </Group>
      </Stack>
    </Stack>
  );
}
