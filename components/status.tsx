import { StatusIndicator } from '@/types/forms';
import Image from 'next/image';

function StatusImage({ status }: { status: StatusIndicator }) {
  let imgSrc = '';

  switch (status) {
    case StatusIndicator.SUCCESS:
      imgSrc = '/status_indicator/success.svg';
      break;
    case StatusIndicator.FAILED:
      imgSrc = '/status_indicator/fail.svg';
      break;
    case StatusIndicator.LOADING:
      imgSrc = '/status_indicator/loading.svg';
      break;
  }

  return <img src={imgSrc} alt='status image' className='h-5 w-5' />;
}

function StatusText({ status }: { status: StatusIndicator }) {
  let statusText = '';
  switch (status) {
    case StatusIndicator.SUCCESS:
      statusText = 'Saved';
      break;
    case StatusIndicator.FAILED:
      statusText = 'Failed to save';
      break;
    case StatusIndicator.LOADING:
      statusText = 'Loading';
      break;
  }

  return <p className='grow pr-2'>{statusText}</p>;
}

export default function Status({ status }: { status: StatusIndicator }) {
  return (
    <div className='flex h-10 w-fit flex-row items-center gap-2 rounded-[20px] border border-solid border-[var(--mantine-color-dark-4)] px-2'>
      <StatusImage status={status} />
      <StatusText status={status} />
    </div>
  );
}
