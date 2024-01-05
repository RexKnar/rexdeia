import Image, { StaticImageData } from 'next/image';

type DashboardCardProps = {
  title: string;
  icon: StaticImageData;
  count: string | number;
};

export function DashboardCard({ icon: src, title, count }: DashboardCardProps) {
  return (
    <div className="flex rounded-md border border-blue-100 bg-white p-3">
      <div className="rounded-full bg-blue-50">
        <Image src={src} width={50} height={50} alt="icon" />
      </div>
      <div className="ml-4">
        <span className="text-xs text-gray-700">{title}</span>
        <h1 className="font-semibold">{count}</h1>
      </div>
    </div>
  );
}
