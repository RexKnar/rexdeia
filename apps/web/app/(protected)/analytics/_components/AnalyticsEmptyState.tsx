import Image from 'next/image';

import noClassListImage from '../../../../public/assets/images/analytics-empty-state_Artboard_1.svg';

export default function AnalyticsEmptyState() {
  return (
    <div className="flex flex-col items-center gap-6 p-6 align-middle">
      <Image alt="icon" width={350} height={350} src={noClassListImage} />
      <div className="flex flex-col items-center gap-1 text-sm">
        <p className="text-base">
          It looks like there are no analytics details available at the moment.
        </p>
        <p className="text-gray-800">
          Let&lsquo;s get started by creating your first class!
        </p>
      </div>
    </div>
  );
}
