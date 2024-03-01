'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from 'utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './Tooltip';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    sliderValues: number[];
  }
>(({ className, sliderValues, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center',
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative mt-2 h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <SliderPrimitive.Thumb className="focus-visible:ring-ring mt-2 block h-4 w-4 rounded-full border border-gray-600 bg-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50" />
        </TooltipTrigger>
        <TooltipContent className="w-5 bg-primary px-4 text-white">
          <label className="flex justify-center">{sliderValues[0]}</label>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <SliderPrimitive.Thumb className="focus-visible:ring-ring mt-2 block h-4 w-4 rounded-full border border-gray-600 bg-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50" />
        </TooltipTrigger>
        <TooltipContent className="w-5 bg-primary px-4 text-white">
          <label className="flex justify-center">{sliderValues[1]}</label>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
