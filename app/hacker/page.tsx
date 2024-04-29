'use client';
import {
  ClerkLoaded,
  ClerkLoading,
  UserProfile,
  useSession,
} from '@clerk/nextjs';
import IsRole from '@/components/auth/IsRole';

export default function Subpage() {
  const { session } = useSession();

  return (
    <>
      <ClerkLoading>
        <div>Loading...</div>
      </ClerkLoading>
      <ClerkLoaded>
        <UserProfile />
        <div>
          Hi, {session?.user.firstName}! You are logged in (this page is hidden
          to logged out people using middleware).
        </div>
      </ClerkLoaded>

      <IsRole role={undefined}>
        <div className='italic'>
          You can see this because you are a <b>Hacker</b>!
        </div>
      </IsRole>

      <IsRole role='admin'>
        <div className='italic'>
          You can see this because you are an <b>Admin</b> (shh, mere hackers
          can&apos;t see this).
        </div>
      </IsRole>

      <IsRole role={[undefined, 'admin']}>
        <div className='italic'>
          You can see this because you are either a <b>Hacker</b> or an{' '}
          <b>Admin</b>.
        </div>
      </IsRole>
    </>
  );
}
