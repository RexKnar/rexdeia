import { Session } from 'next-auth';

export function isAuthenticated(session: Session) {
  return session && session.user && session.branchId && session.organizationId;
}

export function canAccessModule(session: Session, module: string): boolean {
  const moduleAccess = session.user.organizationRole.moduleAccess.find(
    (access) => access.module === module
  );
  return moduleAccess ? moduleAccess.read : false;
}

export function getModuleActions(session: Session, module: string) {
  const moduleAccess = session.user.organizationRole.moduleAccess.find(
    (access) => access.module === module
  );

  if (!moduleAccess) {
    return [];
  }

  const actions = [];
  if (moduleAccess.create) actions.push('create');
  if (moduleAccess.read) actions.push('read');
  if (moduleAccess.update) actions.push('update');
  if (moduleAccess.delete) actions.push('delete');

  return actions;
}

export function filterNavItems(session: Session, navItems: any[]) {
  return navItems.filter((item) => {
    if (item.module) {
      return canAccessModule(session, item.module);
    }
    return true;
  });
}
