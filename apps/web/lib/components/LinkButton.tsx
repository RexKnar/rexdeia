import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import { cn } from 'utils';

type LinkButtonProps = {
  url: string;
  className?: string;
  children: ReactNode;
} & VariantProps<typeof linkButtonVariants>;

const linkButtonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'text-primary-foreground text-black',
        primary:
          'bg-primary text-primary-foreground hover:bg-primary/90 text-white',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export function LinkButton({
  url,
  children,
  className,
  variant,
}: Readonly<LinkButtonProps>) {
  return (
    <Link href={url} className={className}>
      <Slot className={cn(linkButtonVariants({ variant }))}>{children}</Slot>
    </Link>
  );
}
