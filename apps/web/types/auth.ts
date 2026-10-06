export interface ModuleAccess {
  id: string;
  roleId: string;
  module: string;
  scope?: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export type RoleType =
  | 'admin'
  | 'branch_manager'
  | 'hm'
  | 'ahm'
  | 'class_teacher'
  | 'staff'
  | 'finance'
  | 'hr'
  | 'instructor'
  | 'parent'
  | 'student'
  | 'tech'
  | 'custom';

export interface OrganizationRole {
  id: string;
  name: string;
  roleType?: RoleType | string | null;
  archetype?: string | null;
  isSystemRole?: boolean;
  organizationId: string;
  branchId?: string | null;
  moduleAccess: ModuleAccess[];
}

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  username?: string | null;
  role: string;
  staffId?: string | null;
  organizationRole?: OrganizationRole | null;
  createdBranches?: any[];
}

export interface Session {
  user: User;
  expires?: string;
  branchId?: string | null;
  organizationId?: string | null;
  currentBatch?: string | null;
  organizationName?: string | null;
  institute?: string | null;
}

export type Permission = 'create' | 'read' | 'update' | 'delete';
