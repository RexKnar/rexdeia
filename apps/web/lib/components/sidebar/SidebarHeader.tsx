'use client';

import { ChevronDown, Settings } from 'lucide-react';

import { UserMenu } from '../header/UserMenu';
import { useSession } from 'next-auth/react';
import { makeAPICall } from '../../api';
import { FETCH_ORGANIZATION_BY_ID } from '../../endpoints';
import { useEffect, useState } from 'react';
import { OrganizationModal } from '../../domain';

export function SidebarHeader() {
  const [organizationName, setOrganizationName] = useState('');
  const session = useSession();

  useEffect(() => {
    if (session.status === 'authenticated') {
      makeAPICall<OrganizationModal>(
        FETCH_ORGANIZATION_BY_ID,
        {},
        {},
        {
          organizationId: session.data?.organizationId,
        }
      ).then((data) => setOrganizationName(data.name));
    }
  }, [session, session.data?.organizationId]);

  if (session.status === 'loading') {
    return null;
  }

  return (
    <div className="mb-5 flex items-center justify-between gap-3 px-4 text-lg font-semibold tracking-tight">
      <div className="flex items-center gap-4 text-left">
        <UserMenu />
        <div>
          <div className="flex cursor-pointer text-sm font-semibold">
            {organizationName}
            <ChevronDown className="ml-2 h-4 w-4 rounded text-gray-800 hover:bg-gray-200" />
          </div>
        </div>
      </div>
      <div className="p-2 ">
        <Settings className="cursor-pointer text-gray-700" />
      </div>
    </div>
  );
}
