import { cn } from 'utils';

type PageHeaderProps = {
  title: string;
  className?: string;
};

export function PageHeader({ title, className }: PageHeaderProps) {
  return (
    <div className={cn('text-xl font-medium text-black', className)}>
      <h1>{title}</h1>
    </div>
  );
}
