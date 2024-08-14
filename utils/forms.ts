import { Question, FileType } from '@/types/forms';
import { questionType } from '@/types/questionTypes';

export function arrayEquals(a: string[], b: string[]) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function recordEquals(a: Record<string, any>, b: Record<string, any>) {
  // Compare the keys
  if (!arrayEquals(Object.keys(a), Object.keys(b))) return false;

  for (const key in a) {
    if (
      Array.isArray(a[key]) &&
      Array.isArray(b[key]) &&
      !arrayEquals(a[key], b[key])
    )
      return false;
    else {
      if (b[key] !== a[key]) return false;
    }
  }

  return true;
}

export function isNotEmpty(value?: string | string[]): boolean {
  if (!value) {
    return false;
  }

  if (Array.isArray(value)) {
    return true;
  }

  return value.trim() !== '';
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
  return emailRegex.test(email);
}

export function isEmpty(value: string): boolean {
  return value.trim() === '';
}

export function initializeQuestion(
  question: Question,
  responses: Record<string, any>,
  transformed: Record<string, any>
) {
  const resp = responses[question.key];
  switch (question.type) {
    case questionType.agreement:
      transformed[question.key] = resp ?? false;
      break;
    case questionType.file:
      transformed[question.key] = {
        url: resp?.url ?? '',
        value: resp?.value ?? '',
      };
      break;
    default:
      transformed[question.key] = resp ?? '';
      break;
  }
}

export function getMimeTypes(fileTypes: FileType[]): string {
  let accepted = '';

  if (fileTypes.includes(FileType.PDF)) accepted += 'application/pdf,';
  if (fileTypes.includes(FileType.IMG)) accepted += 'image/*,';
  if (fileTypes.includes(FileType.VIDEO)) accepted += 'video/*,';

  return accepted;
}
