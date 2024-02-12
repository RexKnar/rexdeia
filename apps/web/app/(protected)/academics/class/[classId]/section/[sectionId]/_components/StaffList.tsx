'use client';

import { Loader2 } from 'lucide-react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { Button } from 'ui';

import { useGetStaffListBySectionIdQuery } from '../../../../../../../../lib/queries/staff/useGetStaffListBySectionIdQuery';
import { SaveAssignStaffFlyout } from './SaveAssignStaffFlyout';
import { StaffCard } from './StaffCard';

export function StaffList() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ sectionId: string }>();
  const { data: staffListResponse, isLoading: isStaffListLoading } =
    useGetStaffListBySectionIdQuery(params.sectionId, {
      enabled: !!params.sectionId,
    });

  if (isStaffListLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-black" />
        <p className="text-black">Fetching Staff List...</p>
      </div>
    );
  }

  if (!staffListResponse) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-black">No Data Found</p>
      </div>
    );
  }

  return (
    <div>
      <section className="flex justify-between px-2">
        <Button
          variant="default"
          onClick={async () => {
            const params = new URLSearchParams(searchParams);
            params.set('isSaveAssignStaffFlyoutOpen', 'true');

            router.replace(pathname + '?' + params.toString());
          }}
        >
          Assign staff
        </Button>
        <SaveAssignStaffFlyout />
      </section>
      <div className="flex flex-wrap gap-4">
        {staffListResponse.map((staffItem) => (
          <div key={staffItem.id} className="w-[275px]">
            <StaffCard id={staffItem.id} name={staffItem.firstName} />
          </div>
        ))}
      </div>
    </div>
  );
}
