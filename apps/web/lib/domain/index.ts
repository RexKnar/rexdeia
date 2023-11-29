export type { BranchModal, UpdateBranchByIdModel } from './branch';
export type { DepartmentModal } from './department';
export type { FormModal } from './form';
export type { OrganizationModal } from './organization';
export type { CreateShareModal, ShareModal } from './shareModal';
export type { AddStudentModel, Student } from './student';
export type { UserModal } from './user';
export type { UserOrganizationModal } from './userOrganization';

export type PaginatedResponse<T> = {
  data?: T[];
  page: number;
  limit: number;
  total: number;
};
