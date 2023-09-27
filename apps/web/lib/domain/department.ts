import { BranchModal } from './branch';
import { OrganizationModal } from './organization';

export type DepartmentModal = {
  id: string;
  deletedAt: Date;
  branchId: string;
  noOfYears: string;
  isDeleted: boolean;
  description: string;
  branch: BranchModal;
  activeStatus: string;
  departmentName: string;
  departmentCode: string;
  organizationId?: string;
  organization: OrganizationModal;
};
