import { ReactNode } from 'react';
import { Permission } from 'types/auth';

import { useAuth } from '@/hooks/useAuth';

interface ProtectedComponentProps {
  children: ReactNode;
  module: string;
  permission: Permission;
}

export function ProtectedComponent({
  children,
  module,
  permission,
}: ProtectedComponentProps) {
  const { hasPermission } = useAuth();

  if (!hasPermission(module, permission)) {
    return null;
  }

  return <> {children} </>;
}
