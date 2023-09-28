import { BranchModal } from './branch';
import { OrganizationModal } from './organization';
import { UserModal } from './user';

export type UserOrganizationModal = {
  id: string;
  userId: string;
  user: UserModal;
  branchId: string;
  branch: BranchModal;
  organizationId: string;
  organization: OrganizationModal;
};
