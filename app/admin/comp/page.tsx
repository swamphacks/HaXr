'use client';
import { Code } from '@mantine/core';
import { useContext } from 'react';
import { CompetitionContext } from '@/components/admin/AdminShell';

export default function Admin() {
  const { competition } = useContext(CompetitionContext);

  return (
    <>
      Admin. Managing competition with{' '}
      <Code>code = {competition ? `"${competition?.code}"` : 'null'}</Code>.
    </>
  );
}
