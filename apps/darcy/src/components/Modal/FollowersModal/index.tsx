'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import Modal from '@/components/Modal';

interface FollowersModalProps {
  username: string;
}

export default function FollowersModal({ username }: FollowersModalProps) {
  const router = useRouter();

  const onClose = useCallback(() => {
    router.replace(`/${username}`);
  }, [router, username]);

  return (
    <Modal showSolidBackground onClose={onClose}>
      {username}
    </Modal>
  );
}