import { DepartmentModal } from './department';
import { FormModal } from './form';
import { OrganizationModal } from './organization';
import { UserModal } from './user';
import { UserOrganizationModal } from './userOrganization';

export type BranchModal = {
  id: string;
  name: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  forms: FormModal[];
  createdById: string;
  isActivated: boolean;
  createdBy: UserModal;
  organizationId: string;
  department: DepartmentModal[];
  users: UserOrganizationModal[];
  organization: OrganizationModal;
};

export type UpdateBranchByIdModel = Omit<
  BranchModal,
  | 'createdAt'
  | 'updatedAt'
  | 'createdBy'
  | 'organization'
  | 'users'
  | 'forms'
  | 'department'
  | 'organizationId'
  | 'createdById'
  | 'isActivated'
>;
