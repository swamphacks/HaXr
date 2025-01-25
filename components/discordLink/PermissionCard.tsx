import { Card, List, Text } from '@mantine/core';
import PermissionItem from './PermissionItem';

export default function PermissionCard() {
  return (
    <Card withBorder>
      <Text size='md' fw={600} mb='sm'>
        This will allow SwampHacks to:
      </Text>

      <List spacing='sm'>
        <PermissionItem
          title='Access Your Username'
          description='Swamphacks will use your username to identify you.'
          allowed
        />
        <PermissionItem
          title='Change your roles'
          description='Swamphacks will be able to change your roles in Discord.'
          allowed
        />
        <PermissionItem
          title='Cook you a nice meal'
          description="I'm not really a good cook."
          allowed={false}
        />
      </List>
    </Card>
  );
}
