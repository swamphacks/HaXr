import { Group, Stack, Text, TextInput } from '@mantine/core';

export default function InformationStep() {
  return (
    <Stack>
      <Group wrap='nowrap'>
        <TextInput label='First Name' />
        <TextInput label='Last Name' />
      </Group>
      <Group>
        <TextInput w='100%' label='School' />
      </Group>
    </Stack>
  );
}
