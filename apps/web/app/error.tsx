'use client';

import 'configs/tailwind/styles.css';

import Image from 'next/image';
import { Button, Text } from 'ui';

import image from '../public/assets/images/ServerError.gif';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <div className="flex h-screen flex-col items-center justify-center py-64">
        <Image
          src={image}
          alt="server-error"
          aria-label="server-error"
          className="pointer-events-none  mb-px w-96"
        />
        <Text variant="xl-semibold" className="mb-4 text-gray-700">
          Reload after some time
        </Text>
        <div>
          <Button
            variant="default"
            className=" w-40 px-4 py-3"
            onClick={() => reset()}
          >
            Reload
          </Button>
        </div>
      </div>
    </div>
  );
}
