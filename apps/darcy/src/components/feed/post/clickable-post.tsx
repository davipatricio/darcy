'use client';

import isEnterOrClick from '@/utils/isEnterOrClick';
import { useRouter } from 'next/navigation';
import { KeyboardEvent, MouseEvent, PropsWithChildren } from 'react';

interface ClickablePostProps {
  postId?: string;
}

export default function ClickablePost({ children, postId }: PropsWithChildren<ClickablePostProps>) {
  const router = useRouter();

  const handleClick = (event: KeyboardEvent | MouseEvent) => {
    event.preventDefault();

    // skeleton posts don't have a postId
    if (!postId) return;

    // only trigger if the event target is the post itself or a article element (post content)
    if (event.target !== event.currentTarget && (event.target as HTMLElement).tagName !== 'ARTICLE') return;
    if (!isEnterOrClick(event)) return;

    router.push(`/post/${postId}`);
  };

  return (
    <div
      className="overflow-hidden border-b border-b-border p-2 hover:bg-accent"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleClick}
    >
      {children}
    </div>
  );
}
