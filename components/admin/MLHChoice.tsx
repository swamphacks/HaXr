import classes from '@/styles/Input.module.css';
import { answerChoice } from '@/types/questionTypes';

export default function Choice({ choice }: { choice: answerChoice }) {
  return <p className={classes.input}>{choice.value}</p>;
}
