import * as React from 'react';

import { cn } from 'utils';
export interface TextAreaProps
  extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  errorMessage?: string;
}
const Textarea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, errorMessage, onChange, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'border-input placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[60px] w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
