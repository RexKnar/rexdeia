import { Staff } from './staff';

export type StaffCategoryModel = {
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

export type CreateStaffCategoryRequestModel = Pick<
  StaffCategoryModel,
  'name' | 'isActive'
>;

export type UpdateStaffCategoryRequestModel = Pick<
  StaffCategoryModel,
  'id' | 'name' | 'isActive'
>;
