import { getForms } from '@/app/actions/forms';
import FormsTable from '@/components/formCreator/FormsTable';

export default async function FormsTableWrapper() {
  const forms = await getForms();
  return <FormsTable forms={forms} />;
}
