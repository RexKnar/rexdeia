import { ReactNode } from 'react';
import { Permission } from 'types/auth';

import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  module: string;
  permission: Permission;
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  module,
  permission,
  fallback,
}: ProtectedRouteProps) {
  const { hasPermission, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!hasPermission(module, permission)) {
    return fallback || <div>Access denied</div>;
  }

  return <> {children}</>;
}
