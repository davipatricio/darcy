'use client';

import { PropsWithChildren, useCallback } from 'react';

import { BsDiscord, BsGithub } from 'react-icons/bs';
import { FcGoogle } from 'react-icons/fc';

import Button from '@/components/Button';
import clsx from 'clsx';

interface OAuth2ButtonProps {
  service: 'discord' | 'google' | 'github';
}

const Services = {
  discord: {
    link: process.env.NEXT_PUBLIC_DISCORD_AUTH_URL!,
    styles: 'bg-indigo-700 !text-white hover:bg-indigo-700/80',
    Icon: BsDiscord
  },
  google: {
    link: process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL!,
    styles: 'bg-white !text-black hover:bg-white/80',
    Icon: FcGoogle
  },
  github: {
    link: process.env.NEXT_PUBLIC_GITHUB_AUTH_URL!,
    styles: 'bg-neutral-600 !text-white hover:bg-neutral-600/80',
    Icon: BsGithub
  }
}

export default function OAuth2Button({ service, children }: PropsWithChildren<OAuth2ButtonProps>) {
  const serviceData = Services[service];

  const handleRedirect = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      const randomString = Math.random().toString(36);
      const oauthLink = `${serviceData.link}&state=${randomString}`;

      sessionStorage.setItem(`oauth2-state:${service}`, randomString);

      window.location.href = oauthLink;
    },
    [service]
  );

  return (
    <Button className={clsx('gap-2', serviceData.styles)} color="blue" size="md" type="button" onClick={handleRedirect}>
      <serviceData.Icon className="w-6 h-6" />
      {children}
    </Button>
  );
}