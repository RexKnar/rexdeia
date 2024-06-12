import { Staff } from './staff';

export type DesignationModel = {
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

export type CreateDesignationRequestModel = Pick<
  DesignationModel,
  'name' | 'isActive'
>;

export type UpdateDesignationRequestModel = Pick<
  DesignationModel,
  'id' | 'name' | 'isActive'
>;
