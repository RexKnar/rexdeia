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

export type CreateEmploymentTypeRequestModel = Pick<
  EmploymentTypeModel,
  'name' | 'isActive'
>;

export type UpdateEmploymentTypeRequestModel = Pick<
  EmploymentTypeModel,
  'id' | 'name' | 'isActive'
>;
