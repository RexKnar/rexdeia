import { Session } from 'next-auth';

export function isAuthenticated(session: Session) {
  return session && session.user && session.branchId && session.organizationId;
}
