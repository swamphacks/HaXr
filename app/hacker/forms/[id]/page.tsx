import FormContainer from '@/components/forms/FormContainer';
import { getForm } from '@/app/actions/forms';
import { auth } from '@/auth';

export default async function FormView({ params }: { params: { id: string } }) {
  const session = await auth();
  const form = await getForm(params.id);
  return <FormContainer form={form} userEmail={session!.user?.email ?? ''} />;
}
