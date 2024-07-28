import {
  useState,
  useRef,
  useCallback,
  Dispatch,
  SetStateAction,
  MutableRefObject,
} from 'react';

const useStateWithRef = <T>(
  initialValue?: T
): [
  T | undefined,
  Dispatch<SetStateAction<T | undefined>>,
  MutableRefObject<T | undefined>,
] => {
  const [state, setState] = useState<T | undefined>(initialValue);
  const ref = useRef<T | undefined>(state);

  const setStateWithRef: Dispatch<SetStateAction<T | undefined>> = useCallback(
    (value: SetStateAction<T | undefined>) => {
      ref.current =
        typeof value === 'function'
          ? (value as (prevState: T | undefined) => T)(ref.current)
          : value;
      setState(ref.current);
    },
    []
  );

  return [state, setStateWithRef, ref];
};

export default useStateWithRef;
