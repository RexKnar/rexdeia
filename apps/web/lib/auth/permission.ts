import { Permission, Session } from 'types/auth';

export class PermissionManager {
  private session: Session;

  constructor(session: Session) {
    this.session = session;
  }

  /**
   * Check if user has specific permission for a module
   */
  hasPermission(module: string, permission: Permission): boolean {
    const moduleAccess = this.session.user?.organizationRole?.moduleAccess.find(
      (access) => access.module === module
    );

    if (!moduleAccess) {
      return false;
    }

    return moduleAccess[permission];
  }

  /**
   * Check if user has any permission for a module
   */
  hasAnyPermission(module: string): boolean {
    const moduleAccess = this.session.user?.organizationRole?.moduleAccess.find(
      (access) => access.module === module
    );

    if (!moduleAccess) {
      return false;
    }

    return (
      moduleAccess.create ||
      moduleAccess.read ||
      moduleAccess.update ||
      moduleAccess.delete
    );
  }

  /**
   * Get all permissions for a specific module
   */
  getModulePermissions(module: string) {
    const moduleAccess = this.session.user?.organizationRole?.moduleAccess.find(
      (access) => access.module === module
    );

    if (!moduleAccess) {
      return {
        create: false,
        read: false,
        update: false,
        delete: false,
      };
    }

    return {
      create: moduleAccess.create,
      read: moduleAccess.read,
      update: moduleAccess.update,
      delete: moduleAccess.delete,
    };
  }

  /**
   * Get all accessible modules
   */
  getAccessibleModules(): string[] {
    return this.session.user?.organizationRole?.moduleAccess
      .filter((access) => access.read) // At least read permission
      .map((access) => access.module);
  }

  /**
   * Check if user belongs to specific organization/branch
   */
  belongsToOrganization(organizationId: string): boolean {
    return this.session.organizationId === organizationId;
  }

  belongsToBranch(branchId: string): boolean {
    return this.session.branchId === branchId;
  }

  /**
   * Check if user has specific role
   */
  hasRole(roleName: string): boolean {
    return this.session.user.role === roleName;
  }

  /**
   * Check if user has organization role
   */
  hasOrganizationRole(roleName: string): boolean {
    return this.session.user?.organizationRole.name === roleName;
  }
}
