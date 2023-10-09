import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from 'utils';

export type BreadcrumbSeparatorProps = ComponentPropsWithoutRef<'span'>;

export const BreadcrumbSeparator = forwardRef<
  HTMLSpanElement,
  BreadcrumbSeparatorProps
>(({ className, ...props }, forwardedRef) => (
  <span
    ref={forwardedRef}
    role="presentation"
    className={cn('mx-2 opacity-50', className)}
    {...props}
  />
));
