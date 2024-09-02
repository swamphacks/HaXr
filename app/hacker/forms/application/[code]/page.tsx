import FormContainer from '@/components/forms/FormContainer';
import { getApplication } from '@/app/actions/forms';
import { auth } from '@/auth';

export default async function FormView({
  params,
}: {
  params: { code: string };
}) {
  const session = await auth();
  const application = await getApplication(params.code);
  console.log(application?.sections);

  return (
    <FormContainer form={application} userEmail={session!.user?.email ?? ''} />
  );
}
