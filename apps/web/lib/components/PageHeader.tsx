import { cn } from 'utils';

type PageHeaderProps = {
  title: string;
  className?: string;
};

export function PageHeader({ title, className }: PageHeaderProps) {
  return (
    <div className={cn('mt-2 text-xl font-semibold text-black', className)}>
      <h1>{title}</h1>
    </div>
  );
}
