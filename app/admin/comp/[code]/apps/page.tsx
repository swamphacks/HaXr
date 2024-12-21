import { getApplicants } from '@/actions/applications';
import { HackerApplicationFormValues } from '@/app/hacker/application/[code]/page';
import AppsTable from '@/components/applications/AppsTable';

interface Props {
  params: {
    code: string;
  };
}

export default async function Applications({ params: { code } }: Props) {
  const applicants = (await getApplicants(code)).map((a) => ({
    ...a,
    content: a.content as unknown as HackerApplicationFormValues,
  }));

  return <AppsTable applicants={applicants} />;
}
