'use client';

import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'ui';

import { PageTitle } from '@/components/PageTitle';

import { AddScalesFlyout } from '../_modals/AddScalesFlyout';

const RoleManagementFlyout = dynamic(() =>
  import('../_modals/SaveRolemanagementFlyout').then(
    (mod) => mod.RoleManagementFlyout
  )
);

export function RoleManagementPageHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <>
      <section className="flex justify-between px-2">
        <PageTitle title="Role Management" />
        <Button
          variant="default"
          onClick={async () => {
            const params = new URLSearchParams(searchParams);
            params.set('isGradeFlyoutOpen', 'true');

            router.replace(pathname + '?' + params.toString());
          }}
        >
          Add Role Management
        </Button>
      </section>
      <RoleManagementFlyout />
      <AddScalesFlyout />
    </>
  );
}
