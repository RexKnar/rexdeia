import { BranchModal } from './branch';
import { OrganizationModal } from './organization';

export type FormModal = {
  id: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  branchId: string;
  EnquiryForm: any[];
  branch: BranchModal;
  AdmissionForm: any[];
  organizationId: string;
  organization: OrganizationModal;
  json: any; // Json type in Prisma usually maps to any type in TypeScript
};
