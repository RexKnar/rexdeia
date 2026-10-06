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
    if (this.hasRole('Admin') || this.hasRole('BRANCH_MANAGER') || this.getRoleType() === 'admin') {
      return true;
    }

    const moduleAccessList = this.session.user?.organizationRole?.moduleAccess;
    if (!Array.isArray(moduleAccessList)) {
      return false;
    }

    const moduleAccess = moduleAccessList.find(
      (access) => access.module?.toLowerCase() === module?.toLowerCase()
    );

    if (!moduleAccess) {
      return false;
    }

    return Boolean(moduleAccess[permission]);
  }

  /**
   * Check if user has any permission for a module
   */
  hasAnyPermission(module: string): boolean {
    if (this.hasRole('Admin') || this.hasRole('BRANCH_MANAGER') || this.getRoleType() === 'admin') {
      return true;
    }

    const moduleAccessList = this.session.user?.organizationRole?.moduleAccess;
    if (!Array.isArray(moduleAccessList)) {
      return false;
    }

    const moduleAccess = moduleAccessList.find(
      (access) => access.module?.toLowerCase() === module?.toLowerCase()
    );

    if (!moduleAccess) {
      return false;
    }

    return Boolean(
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
    if (this.hasRole('Admin') || this.hasRole('BRANCH_MANAGER') || this.getRoleType() === 'admin') {
      return {
        create: true,
        read: true,
        update: true,
        delete: true,
      };
    }

    const moduleAccessList = this.session.user?.organizationRole?.moduleAccess;
    if (!Array.isArray(moduleAccessList)) {
      return {
        create: false,
        read: false,
        update: false,
        delete: false,
      };
    }

    const moduleAccess = moduleAccessList.find(
      (access) => access.module?.toLowerCase() === module?.toLowerCase()
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
      create: Boolean(moduleAccess.create),
      read: Boolean(moduleAccess.read),
      update: Boolean(moduleAccess.update),
      delete: Boolean(moduleAccess.delete),
    };
  }

  /**
   * Get all accessible modules
   */
  getAccessibleModules(): string[] {
    const moduleAccessList = this.session.user?.organizationRole?.moduleAccess;
    if (!Array.isArray(moduleAccessList)) {
      return [];
    }

    return moduleAccessList
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

  /**
   * Get the static roleType classifier of the user's organization role
   * (admin | hm | ahm | staff | tech), if set.
   */
  getRoleType() {
    return this.session.user?.organizationRole?.roleType ?? null;
  }
}
