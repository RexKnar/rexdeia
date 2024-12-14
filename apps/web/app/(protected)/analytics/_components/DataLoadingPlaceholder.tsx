import Image from 'next/image';

export function DataLoadingPlaceholder({
  title,
  description,
  subDescription,
  image,
}: {
  title?: string;
  description?: string;
  subDescription?: string;
  image?: any;
}) {
  return (
    <div className="flex flex-col items-center gap-6 p-6 align-middle">
      {image && <Image alt="icon" width={320} height={320} src={image} />}
      <div className="flex flex-col items-center gap-1 text-sm">
        {title && <h1 className="text-2xl font-bold">{title}</h1>}
        {description && <p className="text-base">{description}</p>}
        {subDescription && <p className="text-gray-800">{subDescription}</p>}
      </div>
    </div>
  );
}
