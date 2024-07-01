import { useSession } from 'next-auth/react';

export function useRole(allowedRoles) {
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  return allowedRoles.includes(userRole);
}
