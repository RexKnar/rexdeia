'use client';

import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'ui';

import { PageTitle } from '@/components/PageTitle';

const AssignUsersRoleFlyout = dynamic(() =>
  import('../_models/AssignUsersRoleFlyout').then(
    (mod) => mod.AssignUsersRoleFlyout
  )
);

export function UserRoleListHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <>
      <section className="flex justify-between px-2">
        <PageTitle title="User Role List" />
        <Button
          variant="default"
          onClick={async () => {
            const params = new URLSearchParams(searchParams);
            params.set('isAssignUsersOpen', 'true');

            router.replace(pathname + '?' + params.toString());
          }}
        >
          Add New User
        </Button>
      </section>
      <AssignUsersRoleFlyout />
    </>
  );
}
