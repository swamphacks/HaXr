import { StatusIndicator } from '@/types/forms';

function StatusImage({ status }: { status: StatusIndicator }) {
  switch (status) {
    case StatusIndicator.SUCCESS:
      return <div className='h-4 w-4 rounded-full bg-green-400' />;
    case StatusIndicator.FAILED:
      return <div className='h-4 w-4 rounded-full bg-red-500' />;
    case StatusIndicator.SAVING:
    case StatusIndicator.LOADING:
      return <div className='h-4 w-4 rounded-full bg-gray-500' />;
    case StatusIndicator.SUBMITTED:
      return <div className='h-4 w-4 rounded-full bg-blue-400' />;
  }
}

function StatusText({ status }: { status: StatusIndicator }) {
  let statusText = '';
  switch (status) {
    case StatusIndicator.SUCCESS:
      statusText = 'Saved';
      break;
    case StatusIndicator.FAILED:
      statusText = 'Failed';
      break;
    case StatusIndicator.LOADING:
      statusText = 'Loading';
      break;
    case StatusIndicator.SUBMITTED:
      statusText = 'Submitted';
      break;
    case StatusIndicator.SAVING:
      statusText = 'Saving';
      break;
  }

  return <p className='grow pr-2'>{statusText}</p>;
}

export default function Status({ status }: { status: StatusIndicator }) {
  return (
    <div className='flex h-10 w-fit flex-row items-center gap-2 rounded-full border border-solid border-[var(--mantine-color-dark-4)] px-3'>
      <StatusImage status={status} />
      <StatusText status={status} />
    </div>
  );
}
