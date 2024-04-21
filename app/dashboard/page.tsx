'use client';
import { ClerkLoaded, ClerkLoading, useSession } from '@clerk/nextjs';
import IsRole from '@/components/auth/IsRole';

export default function Subpage() {
  const { session } = useSession();

  return (
    <>
      <ClerkLoading>
        <div>Loading...</div>
      </ClerkLoading>
      <ClerkLoaded>
        <div>
          Hi, {session?.user.firstName}! You are logged in (this page is hidden
          to logged out people using middleware).
        </div>
      </ClerkLoaded>

      <IsRole role='admin'>
        <div className='italic'>
          You can see this because you are an <b>Admin</b> (shh, organizers and
          applicants cannot).
        </div>
      </IsRole>

      <IsRole role={['organizer', 'admin']}>
        <div className='italic'>
          You can see this because you are either an <b>Organizer</b> or an{' '}
          <b>Admin</b>.
        </div>
      </IsRole>
    </>
  );
}
