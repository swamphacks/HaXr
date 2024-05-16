import { CSS } from '@dnd-kit/utilities';

import classes from '@/styles/Input.module.css';

export default function Choice({ choice }: { choice: string }) {
  return <p className={classes.input}>{choice}</p>;
}
