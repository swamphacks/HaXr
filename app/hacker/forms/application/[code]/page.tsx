import ViewForm from '@/components/forms/Form';
import { auth } from '@/auth';

export default async function FormView({ params }: { params: { id: string } }) {
  const session = await auth();
  return (
    <ViewForm formId={params.id} session={session!} onApplication={true} />
  );
}
