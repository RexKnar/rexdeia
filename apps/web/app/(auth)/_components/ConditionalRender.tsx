import { ReactNode } from 'react';
import { Permission } from 'types/auth';

import { useAuth } from '@/hooks/useAuth';

interface ConditionalRenderProps {
  module: string;
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

export function ConditionalRender({
  module,
  permission,
  children,
  fallback,
}: ConditionalRenderProps) {
  const { hasPermission } = useAuth();

  return hasPermission(module, permission) ? (
    <> {children} </>
  ) : (
    <> {fallback} </>
  );
}
