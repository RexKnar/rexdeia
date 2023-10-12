import { ComponentPropsWithoutRef, ElementType, forwardRef } from 'react';
import { BreadcrumbItemProps } from './BreadcrumbItem';
import { cn } from 'utils';

export interface BreadcrumbLinkProps
  extends ComponentPropsWithoutRef<'a'>,
    Pick<BreadcrumbItemProps, 'isCurrentPage'> {
  as?: ElementType;
}

export const BreadcrumbLink = forwardRef<
  HTMLAnchorElement,
  BreadcrumbLinkProps
>(({ className, as: asComp = 'a', isCurrentPage, ...props }, forwardedRef) => {
  const Comp = isCurrentPage ? 'span' : asComp;

  return (
    <Comp
      ref={forwardedRef}
      aria-current={isCurrentPage ? 'page' : undefined}
      className={cn(
        'text-sm font-medium underline-offset-4 aria-[current]:opacity-60 [&:not([aria-current])]:hover:underline',
        className,
      )}
      {...props}
    />
  );
});
