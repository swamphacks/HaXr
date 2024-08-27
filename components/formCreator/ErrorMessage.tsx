import { FormValidationError } from '@/types/forms';

export default function ErrorMessage({
  error,
}: {
  error: FormValidationError;
}) {
  if (error) {
    return <p className='text-sm text-red-500'>{error.message}</p>;
  }

  return null;
}
