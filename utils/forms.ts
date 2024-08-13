import { Question, FormSection, FileResponse } from '@/types/forms';
import { questionType } from '@/types/questionTypes';

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
        url: resp.url ?? '',
        value: resp.value ?? '',
      };
      break;
    default:
      transformed[question.key] = resp ?? '';
      break;
  }
}
