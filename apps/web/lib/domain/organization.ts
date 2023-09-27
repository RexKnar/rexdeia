import { BranchModal } from './branch';
import { DepartmentModal } from './department';
import { FormModal } from './form';
import { UserModal } from './user';
import { UserOrganizationModal } from './userOrganization';

export type OrganizationModal = {
  id: string;
  name: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  institute: string;
  forms: FormModal[];
  createdById: string;
  isActivated: boolean;
  createdBy: UserModal;
  description?: string;
  branches: BranchModal[];
  department: DepartmentModal[];
  users: UserOrganizationModal[];
};
