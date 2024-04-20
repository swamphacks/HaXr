'use client';
import { ClerkLoaded, ClerkLoading, useSession } from '@clerk/nextjs';

export default function Subpage() {
  const { isLoaded, session } = useSession();

  if (isLoaded)
    return (
      <>
        <ClerkLoading>
          <div>Loading...</div>
        </ClerkLoading>
        <ClerkLoaded>
          <div>
            Hi, {session?.user.firstName}! You are logged in (this page is
            hidden to logged out people using middleware).
          </div>
        </ClerkLoaded>
      </>
    );
}
