import { auth } from '@/auth';

export default async function Hacker() {
  const stuff = await auth();

  return (
    <>
      <h1>Hacker</h1>
      <p>User ID: {stuff?.user?.id}</p>
    </>
  );
}
