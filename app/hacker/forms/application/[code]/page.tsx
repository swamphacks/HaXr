import FormContainer from '@/components/forms/FormContainer';
import { auth } from '@/auth';

export default async function FormView({ params }: { params: { id: string } }) {
  const session = await auth();
  return (
    <FormContainer
      formId={params.id}
      userEmail={session!.user?.email ?? ''}
      onApplication={true}
    />
  );
}
