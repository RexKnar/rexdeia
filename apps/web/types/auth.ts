export interface ModuleAccess {
  id: string;
  roleId: string;
  module: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export type RoleType = 'admin' | 'hm' | 'ahm' | 'staff' | 'tech';

export interface OrganizationRole {
  id: string;
  name: string;
  roleType?: RoleType | null;
  organizationId: string;
  branchId: string;
  moduleAccess: ModuleAccess[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  staffId: string;
  organizationRole: OrganizationRole;
}

export interface Session {
  user: User;
  expires: string;
  branchId: string;
  organizationId: string;
  currentBatch: string;
  organizationName: string;
  institute: string;
}

export type Permission = 'create' | 'read' | 'update' | 'delete';
