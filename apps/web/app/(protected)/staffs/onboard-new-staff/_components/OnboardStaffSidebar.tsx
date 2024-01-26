'use client';

import { motion } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'ui';
import { cn } from 'utils';

export function OnboardStaffSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStep = parseInt(searchParams.get('step')) || 0;

  return (
    <ul className="rounded-lg bg-white py-3">
      <li>
        <Button
          type="button"
          variant="link"
          onClick={() => {
            const params = new URLSearchParams(searchParams);
            params.set('step', '0');

            router.replace(pathname + '?' + params.toString());
          }}
          className="grid cursor-pointer grid-cols-[4px_minmax(170px,_1fr)_10px] px-4 py-1 hover:no-underline"
        >
          <motion.div
            initial={false}
            animate={{
              opacity: currentStep === 0 ? 1 : 0,
            }}
            className="h-6 border-l-2 border-primary"
          />
          <h2
            className={cn(
              'px-2 text-left text-sm font-semibold',
              currentStep === 1 ? 'text-primary' : 'text-gray-800'
            )}
          >
            Basic Details
          </h2>
        </Button>
      </li>

      <li>
        <Button
          type="button"
          variant="link"
          onClick={() => {
            const params = new URLSearchParams(searchParams);
            params.set('step', '1');

            router.replace(pathname + '?' + params.toString());
          }}
          className="grid cursor-pointer grid-cols-[4px_minmax(170px,_1fr)_10px] px-4 py-1 hover:no-underline"
        >
          <motion.div
            initial={false}
            animate={{
              opacity: currentStep === 1 ? 1 : 0,
            }}
            className="h-6 border-l-2 border-primary"
          />
          <h2 className={`px-2 text-left text-sm font-semibold`}>
            Address Details
          </h2>
        </Button>
      </li>

      <li>
        <Button
          type="button"
          variant="link"
          onClick={() => {
            const params = new URLSearchParams(searchParams);
            params.set('step', '2');

            router.replace(pathname + '?' + params.toString());
          }}
          className="grid cursor-pointer grid-cols-[4px_minmax(170px,_1fr)_10px] px-4 py-1 hover:no-underline"
        >
          <motion.div
            initial={false}
            animate={{
              opacity: currentStep === 2 ? 1 : 0,
            }}
            className="h-6 border-l-2 border-primary"
          />
          <h2 className={`px-2 text-left text-sm font-semibold`}>
            Parents Details
          </h2>
        </Button>
      </li>

      <li>
        <Button
          type="button"
          variant="link"
          onClick={() => {
            const params = new URLSearchParams(searchParams);
            params.set('step', '3');

            router.replace(pathname + '?' + params.toString());
          }}
          className="grid cursor-pointer grid-cols-[4px_minmax(170px,_1fr)_10px] px-4 py-1 hover:no-underline"
        >
          <motion.div
            initial={false}
            animate={{
              opacity: currentStep === 3 ? 1 : 0,
            }}
            className="h-6 border-l-2 border-primary"
          />
          <h2 className={`px-2 text-left text-sm font-semibold`}>
            Additional Details
          </h2>
        </Button>
      </li>
    </ul>
  );
}
