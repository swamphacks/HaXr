import {
  useState,
  useRef,
  useCallback,
  Dispatch,
  SetStateAction,
  MutableRefObject,
} from 'react';
import { Prisma, Form } from '@prisma/client';
import { FormSection } from '@/types/forms';

const useFormStateWithRefs = (
  initialValue: Form
): [
  Form,
  Dispatch<SetStateAction<Form>>,
  Dispatch<SetStateAction<FormSection[]>>,
  MutableRefObject<Form>,
] => {
  const [state, setState] = useState<Form>(initialValue);
  const formRef = useRef<Form>(state);

  const setStateWithRef: Dispatch<SetStateAction<Form>> = useCallback(
    (value: SetStateAction<Form>) => {
      formRef.current =
        typeof value === 'function'
          ? (value as (prevState: Form) => Form)(formRef.current)
          : value;
      setState(formRef.current);
    },
    []
  );

  const setSections: Dispatch<SetStateAction<FormSection[]>> = useCallback(
    (value: SetStateAction<FormSection[]>) => {
      const newSections =
        typeof value === 'function'
          ? (value as (prevSections: FormSection[]) => FormSection[])(
              formRef.current.sections as unknown as FormSection[]
            )
          : value;

      formRef.current = {
        ...formRef.current,
        sections: newSections as unknown as Prisma.JsonArray,
      };
      setState(formRef.current);
    },
    []
  );

  return [state, setStateWithRef, setSections, formRef];
};

export default useFormStateWithRefs;
