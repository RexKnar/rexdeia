// hooks/useAuth.ts
import { PermissionManager } from 'lib/auth/permission';
import { useSession } from 'next-auth/react';
import { Permission, Session } from 'types/auth';

export function useAuth() {
  const { data: session, status } = useSession();

  const permissionManager = session
    ? new PermissionManager(session as Session)
    : null;

  return {
    session: session as Session,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    permissionManager,
    hasPermission: (module: string, permission: Permission) =>
      permissionManager?.hasPermission(module, permission) || false,
    hasAnyPermission: (module: string) =>
      permissionManager?.hasAnyPermission(module) || false,
    getModulePermissions: (module: string) =>
      permissionManager?.getModulePermissions(module) || {
        create: false,
        read: false,
        update: false,
        delete: false,
      },
    getAccessibleModules: () => permissionManager?.getAccessibleModules() || [],
  };
}
