import { QuestionValidationError } from '@/types/forms';

export default function ErrorMessage({
  error,
}: {
  error: QuestionValidationError;
}) {
  if (error) {
    return <p className='text-sm text-red-500'>{error.message}</p>;
  }

  return null;
}
