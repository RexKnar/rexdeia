import { CheckCircle, LucideIcon } from 'lucide-react';

type VideoOptionCardProps = {
  name: string;
  isSelected: boolean;
  onClick: () => void;
  IconComponent: LucideIcon;
};

export default function VideoOptionCard(props: VideoOptionCardProps) {
  const { IconComponent, isSelected, name, onClick } = props;
  const selectedStyle = 'border-primary-500 text-primary-600';

  return (
    <section className="bg-card text-card-foreground p relative mr-2 flex cursor-pointer rounded-md border text-gray-600 shadow">
      <section
        onClick={onClick}
        className={`flex flex-row items-center justify-center gap-3 px-5 py-2 ${
          isSelected ? selectedStyle : ''
        }`}
      >
        {isSelected && (
          <div>
            <CheckCircle className="h-4 w-4 font-normal" />
          </div>
        )}
        <div className="font-normal">{name}</div>
        <IconComponent className="h-8 w-8 font-normal" strokeWidth={1} />
      </section>
    </section>
  );
}
