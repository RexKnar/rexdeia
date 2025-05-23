'use client';

import { PencilRuler, Settings, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Separator, Text } from 'ui';

export function CourseCard({
  imgSrc,
  courseName,
  courseId,
  type,
}: {
  imgSrc: string;
  courseName: string;
  courseId: string;
  type?: string;
}) {
  return (
    <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white shadow-lg">
      <div className="flex h-full flex-col items-center justify-between p-2">
        <div className="flex h-full w-full justify-center">
          {imgSrc ? (
            <div className="relative h-64 w-full overflow-hidden rounded-md">
              <Image
                src={imgSrc}
                alt="Cover"
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
          ) : (
            <div className="flex h-auto min-h-60 w-full items-center justify-center bg-gray-200">
              <span className="text-xl font-bold">{courseName[0] || 'C'}</span>
            </div>
          )}
        </div>

        <div className="w-full py-3">
          <Separator className="my-4 bg-gray-400" decorative />
          <div className="p-2">
            <Link href={`/institute/courses/${courseId}`}>
              <Text className="text-gray w-full text-center">{courseName}</Text>
            </Link>
          </div>
          <Separator className="my-4 bg-gray-400" decorative />
          {type !== 'learner' && (
            <div className="flex h-5 items-center justify-evenly space-x-4 text-sm">
              <Link
                className="flex w-full cursor-pointer justify-center"
                href={`/institute/courses/${courseId}/builder`}
              >
                <PencilRuler />
              </Link>
              <Separator orientation="vertical" className="bg-gray-400" />
              <Link
                href={`/institute/courses/${courseId}/learners`}
                className="flex w-full cursor-pointer justify-center"
              >
                <Users />
              </Link>
              <Separator orientation="vertical" className="bg-gray-400" />

              <Link
                className="flex w-full cursor-pointer justify-center"
                href={`/institute/courses/${courseId}/settings`}
              >
                <Settings />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
