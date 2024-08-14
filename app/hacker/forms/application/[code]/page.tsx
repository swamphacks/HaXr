import ViewForm from '@/components/forms/Form';

export default function FormView({ params }: { params: { id: string } }) {
  return <ViewForm formId={params.id} />;
}
