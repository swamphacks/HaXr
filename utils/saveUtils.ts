import { FormSection, Question } from '@/types/forms';

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
    else if (b[key] !== a[key]) return false;
  }

  return true;
}

export function questionEquals(a: Question, b: Question) {
  if (!recordEquals(a.settings, b.settings)) return false;
  return recordEquals(
    { ...a, settings: undefined },
    { ...b, settings: undefined }
  );
}

export function sectionEquals(a: FormSection, b: FormSection) {
  if (a.key !== b.key) return false;
  if (a.title !== b.title) return false;
  if (a.description !== b.description) return false;
  if (a.questions.length !== b.questions.length) return false;

  for (let i = 0; i < a.questions.length; i++) {
    if (!questionEquals(a.questions[i], b.questions[i])) return false;
  }

  return true;
}
