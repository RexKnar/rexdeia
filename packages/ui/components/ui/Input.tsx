import * as React from 'react';
import { cn } from 'utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, placeholder, errorMessage, ...props }, ref) => {
    return (
      <>
        <input
          type={type}
          placeholder={placeholder}
          className={cn(
            'ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border border-primary-200 bg-transparent p-4 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-50 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          {...props}
        />
        {errorMessage ? (
          <p
            className={cn(
              'h-2 p-1 text-sm text-red-600',
              Boolean(errorMessage)
                ? 'opacity-1 transition-opacity duration-300'
                : 'opacity-0 transition-opacity duration-300',
            )}
          >
            {errorMessage}
          </p>
        ) : null}
      </>
    );
  },
);
Input.displayName = 'Input';

export { Input };
