import ConfigureCompetition from '@/components/configure/ConfigureCompetition';
import { getCompetition } from '@/actions/competition';

interface Props {
  params: {
    code: string;
  };
}

export default async function Configure({ params: { code } }: Props) {
  const competition = await getCompetition(code);

  return <ConfigureCompetition competition={competition!} />;
}
