'use client';

import LoadingSpinner from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useState } from 'react';

export default function UserFollowButton({ handle }: { handle: string }) {
  // TODO: Implement follow functionality
  const [fakeLoading, setFakeLoading] = useState(false);
  const currentUser = useCurrentUser();

  if (currentUser.handle === handle) return null;

  const handleFollow = () => {
    setFakeLoading(true);
    setTimeout(() => setFakeLoading(false), 1000);
  };

  return (
    <div className="absolute -bottom-14 right-2.5 flex items-end justify-center sm:-bottom-14">
      <Button variant="secondary" className="rounded-full font-bold gap-2" size="md" onClick={handleFollow}>
        {fakeLoading && <LoadingSpinner />}
        Seguir
      </Button>
    </div>
  );
}
