import { Form } from '@prisma/client';
import { FormSection } from '@/types/forms';

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

export function objectEquals(
  a: Record<string, any>,
  b: Record<string, any>
): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (Object.keys(a).length !== Object.keys(b).length) return false;

  return Object.keys(a).every((key: string) => {
    if (typeof a[key] !== typeof b[key]) return false;
    if (Array.isArray(a[key]) && Array.isArray(b[key]))
      return arrayEquals(a[key], b[key]);
    if (a[key] instanceof Date && b[key] instanceof Date)
      return a[key].getTime() === b[key].getTime();
    if (typeof a[key] === 'object') return objectEquals(a[key], b[key]);
    return a[key] === b[key];
  });
}

export function arrayEquals<T>(a: T[], b: T[]): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (a.length !== b.length) return false;

  return a.every((val: T, index: number) => {
    if (Array.isArray(val) && Array.isArray(b[index]))
      return arrayEquals(val, b[index] as any);
    if (typeof val === 'object')
      return objectEquals(val as any, b[index] as any);
    return val === b[index];
  });
}
