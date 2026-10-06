import { UserModal } from './user';

export type RoleModel = {
  id: string;
  name: string;
  archetype?: string;
  isSystemRole?: boolean;
  UserOrganization: {
    user: UserModal;
    branchId: string;
    organizationId: string;
    id: string;
    roleId: string;
    userId: string;
  }[];
  moduleAccess: {
    id: string;
    module: string;
    scope?: string;
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  }[];
};

export type ModuleAccessModel = {
  id: string;
  roleId: string;
  module: string;
  scope?: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  isEditing?: boolean;
};

export type AddRoleModel = {
  name: string;
  archetype?: string;
  moduleAccess: {
    module: string;
    scope?: string;
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  }[];
};

export type UpdateRoleModel = {
  id: string;
  name: string;
  archetype?: string;
  moduleAccess: {
    module: string;
    scope?: string;
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  }[];
};
