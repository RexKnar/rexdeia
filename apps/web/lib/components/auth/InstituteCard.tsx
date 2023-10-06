import { CheckCircle, LucideIcon } from 'lucide-react';
import { cn } from 'utils';

type InstituteCardProps = {
  name: string;
  isSelected: boolean;
  onClick: () => void;
  IconComponent: LucideIcon;
};

export function InstituteCard(props: InstituteCardProps) {
  const { IconComponent, isSelected, name, onClick } = props;
  const selectedStyle = 'border-primary-500 text-primary-600';

  return (
    <section className="bg-card text-card-foreground relative mr-2 flex cursor-pointer rounded-md border p-4 text-gray-600 shadow">
      <section
        onClick={onClick}
        className={`flex flex-col items-center justify-center px-5 ${
          isSelected ? selectedStyle : ''
        }`}
      >
        <div
          className={cn(
            'absolute left-2 top-0 mt-2',
            isSelected ? 'visible' : 'invisible'
          )}
        >
          <CheckCircle />
        </div>
        <div className="font-normal">{name}</div>
        <IconComponent className="h-12 w-12 font-normal" strokeWidth={1} />
      </section>
    </section>
  );
}
