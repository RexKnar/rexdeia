import 'configs/tailwind/styles.css';

import Image from 'next/image';
import { Text } from 'ui';

import { LinkButton } from '@/components/LinkButton';

import image from '../public/assets/images/ErrorImage.gif';

export default async function NotFoundPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center py-64">
      <Image
        src={image}
        alt="error-404"
        aria-label="error-404"
        className="pointer-events-none  mb-px w-96"
      />

      <Text variant="3xl-bold" className="mb-4 text-black">
        Something’s missing.
      </Text>
      <Text variant="sm-semibold" className="mb-4 text-gray-700">
        The page you looking for is not found.
      </Text>
      <div>
        <LinkButton variant="primary" url="/admission/dashboard">
          Go to dashboard
        </LinkButton>
      </div>
    </div>
  );
}
