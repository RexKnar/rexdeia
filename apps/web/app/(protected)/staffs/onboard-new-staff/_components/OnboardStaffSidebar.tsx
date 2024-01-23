'use client';

import { motion } from 'framer-motion';
import { parseAsInteger, useQueryState } from 'next-usequerystate';
import React from 'react';
import { Button } from 'ui';
import { cn } from 'utils';

export function OnboardStaffSidebar() {
  const [currentStep, setCurrentStep] = useQueryState(
    'step',
    parseAsInteger.withDefault(0)
  );

  return (
    <ul className="rounded-lg bg-white py-3">
      <li>
        <Button
          type="button"
          variant="link"
          onClick={() => setCurrentStep(0)}
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
          onClick={() => setCurrentStep(1)}
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
          onClick={() => setCurrentStep(2)}
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
          onClick={() => setCurrentStep(3)}
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
