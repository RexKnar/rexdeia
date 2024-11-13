import { cva, type VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import React from 'react';
import { cn } from 'utils';

export interface LinkButtonProps
  extends React.ButtonHTMLAttributes,
    VariantProps {
  asChild?: boolean;
  url: string;
}

const linkButtonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'text-primary-foreground',
        primary: 'bg-primary hover:bg-primary/90 text-white',
        outline:
          'border-input border-primary border hover:bg-accent hover:text-accent-foreground text-primary',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        xs: 'h-7 px-3 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export function LinkButton({ url, variant, className, children }: Readonly) {
  return (
    <Link href={url} className={cn(linkButtonVariants({ variant, className }))}>
      {children}
    </Link>
  );
}
