import { UserModal } from './user';

export type RoleModel = {
  id: string;
  name: string;
  UserOrganization: {
    user: UserModal;
    branchId: string;
    organizationId: string;
    id: string;
    roleId: string;
    userId: string;
  }[];
  moduleAccess: {
    module: string;
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
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  isEditing?: boolean;
};

export type AddRoleModel = Pick<RoleModel, 'name' | 'moduleAccess'>;
