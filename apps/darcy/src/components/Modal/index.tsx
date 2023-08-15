'use client';

import clsx from 'clsx';
import { useCallback, useEffect } from 'react';
import { HiX } from 'react-icons/hi';

interface ModalProps extends React.ComponentProps<'div'> {
  onClose: () => void;
  showSolidBackground?: boolean;
}

export default function Modal(props: ModalProps) {
  const handleClose = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) props.onClose();
    },
    [props]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') props.onClose();
    };

    // add tabindex to all elements that is not data-modal and its children
    const elements = [...document.body.querySelectorAll('*')].filter((element: Element) => !element.closest('[data-modal]'));

    for (const element of elements) {
      if (element instanceof HTMLElement) element.setAttribute('tabindex', '-1');
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [props]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      {...props}
      data-modal
      className={clsx(
        'fixed inset-0 z-10 flex h-full w-full items-center justify-center overflow-y-auto bg-background/90 p-2 sm:p-0',
        props.className
      )}
      onClick={handleClose}
    >
      <div className={clsx('relative p-4', props.showSolidBackground && 'rounded-lg border border-grayBorder bg-background')}>
        <button
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          aria-label="Close modal"
          className="absolute left-3 top-4 text-textPrimary hover:text-textSecondary focus:text-textSecondary"
          title="Close modal"
          type="button"
          onClick={props.onClose}
        >
          <HiX className="h-6 w-6 sm:h-8 sm:w-8" />
        </button>

        <div className="rounded-lg pl-6">{props.children}</div>
      </div>
    </div>
  );
}
