import { Code } from '@mantine/core';

interface Props {
  params: {
    code: string;
  };
}

export default function Admin({ params: { code } }: Props) {
  return (
    <>
      Admin. Managing competition with <Code>code = {code}</Code>.
    </>
  );
}
