import { Staff } from './staff';

export type EmploymentTypeModel = {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  isDeleting?: boolean;
  isUpdating?: boolean;
  isNewlyAdded?: boolean;
  staff?: Staff[];
};

export type CreateEmploymentTypeRequestModel = Pick;

export type UpdateEmploymentTypeRequestModel = Pick;
