'use client';
import InformationStep from '@/components/onboarding/InformationStep';
import {
  Anchor,
  Button,
  Checkbox,
  Container,
  FileInput,
  Group,
  MultiSelect,
  Progress,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Stepper,
  Text,
  Textarea,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import {
  IconArrowBack,
  IconArrowLeft,
  IconArrowLeftBar,
} from '@tabler/icons-react';
import { useState } from 'react';

export default function Onboarding() {
  const [active, setActive] = useState(1);
  const nextStep = () =>
    setActive((current) => (current < 5 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 1 ? current - 1 : current));

  const renderContent = () => {
    switch (active) {
      case 1:
        return <InformationStep />;
      case 2:
        return <Text>Step 2: Interests</Text>;
      case 3:
        return <Text>Step 3: Roles</Text>;
      case 4:
        return <Text>Step 4: Allergies</Text>;
      case 5:
        return <Text>Step 5: Confirmation</Text>;
      default:
        return null;
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
          <Button w='18%' onClick={nextStep}>
            Save and Continue
          </Button>
        </Group>
      </Stack>
    </Stack>
  );
}
