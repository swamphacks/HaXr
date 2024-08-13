import { Question, FormSection } from '@/types/forms';
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
  answers: Record<string, any>,
  values: Record<string, any>
) {
  switch (question.type) {
    case questionType.agreement:
      values[question.key] = answers[question.key] ?? false;
      break;
    default:
      values[question.key] = answers[question.key] ?? '';
      break;
  }
}
