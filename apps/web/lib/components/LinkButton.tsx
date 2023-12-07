import Link from 'next/link';
import React, { ReactNode } from 'react';

type LinkButtonProps = {
  url: string;
  className?: string;
  children: ReactNode;
};

export function LinkButton({
  url,
  children,
  className,
}: Readonly<LinkButtonProps>) {
  return (
    <Link href={url} className={className}>
      {children}
    </Link>
  );
}
