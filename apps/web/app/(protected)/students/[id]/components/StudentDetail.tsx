'use client';
import { useParams } from 'next/navigation';
import { Text } from 'ui';

import { useGetStudentDetailsByIdQuery } from '../../../../../lib/queries/useGetStudentDetailsByIdQuery';

export function StudentDetail() {
  const { id } = useParams();
  const { data: classList } = useGetStudentDetailsByIdQuery(id.toString());

  return (
    <div className="flex gap-4">
      <div className="h-full w-1/6 shrink-0 rounded-lg bg-white p-4">
        <div className="w-full px-2 text-center">
          <div className="text-start">
            <ul className="h-fit shrink-0 rounded-lg">
              <li className="border-box group mt-3 cursor-pointer rounded-lg px-4 py-3 hover:bg-primary-100 hover:text-primary">
                <Text className="px-2 text-sm font-semibold text-gray-800 group-hover:text-black">
                  Personal Info
                </Text>
              </li>
              <li className="border-box group mt-3 cursor-pointer rounded-lg px-4 py-3 hover:bg-primary-100 hover:text-primary">
                <Text className="px-2 text-sm font-semibold text-gray-800 group-hover:text-black">
                  Educational Info
                </Text>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full rounded-lg bg-white p-2">
        <div className="mt-1 p-4">
          <div className="flex flex-wrap gap-4">
            <div className="p-4">
              <Text variant="sm-regular" className="gray-700">
                First Name
              </Text>
              <Text variant="base-semibold">Sobin JM</Text>
            </div>
            <div className="p-4">
              <Text variant="sm-regular" className="gray-700">
                First Name
              </Text>
              <Text variant="base-semibold">Sobin JM</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
