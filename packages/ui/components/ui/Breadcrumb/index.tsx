import React, { forwardRef, ReactNode, ComponentPropsWithoutRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from 'utils';
import { getValidChildren } from './utils';

export type BreadcrumbProps = ComponentPropsWithoutRef<'nav'> & {
  separator?: ReactNode;
  addSeparator?: boolean;
};

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      children,
      className,
      addSeparator = true,
      separator = <ChevronRight className="h-4 w-4" />,
      ...props
    },
    forwardedRef
  ) => {
    const validChildren = getValidChildren(children);
    const clones = validChildren.map((child, index) =>
      React.cloneElement(child, {
        addSeparator,
        separator,
        isLastChild: validChildren.length === index + 1,
      })
    );

    return (
      <nav
        className={cn('relative break-words', className)}
        aria-label="breadcrumb"
        ref={forwardedRef}
        {...props}
      >
        <ol className="flex items-center">{clones}</ol>
      </nav>
    );
  }
);
