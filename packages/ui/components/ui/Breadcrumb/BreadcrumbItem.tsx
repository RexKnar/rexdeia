import { cloneElement, forwardRef } from 'react';
import { BreadcrumbProps } from '.';
import { getValidChildren } from './utils';
import { BreadcrumbLink } from './BreadcrumbLink';
import { BreadcrumbSeparator } from './BreadcrumbSeparator';
import { cn } from 'utils';

export type BreadcrumbItemProps = BreadcrumbProps & {
  isLastChild?: boolean;
  isCurrentPage?: boolean;
};

export const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  (
    {
      children,
      className,
      separator,
      isLastChild,
      addSeparator,
      isCurrentPage,
      ...props
    },
    forwardedRef,
  ) => {
    const validChildren = getValidChildren(children);

    const clones = validChildren.map((child) => {
      if (child.type === BreadcrumbLink) {
        return cloneElement(child, { isCurrentPage });
      }

      if (child.type === BreadcrumbSeparator) {
        return cloneElement(child, {
          children: separator ?? child.props.children,
        });
      }

      return child;
    });

    return (
      <li
        ref={forwardedRef}
        className={cn('inline-flex items-center', className)}
        {...props}
      >
        {clones}
        {!isLastChild && addSeparator && (
          <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
        )}
      </li>
    );
  },
);
