import { Staff } from './staff';
import { Student } from './student';

export type CommunityModel = {
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
  student?: Student[];
};

export type CreateCommunityRequestModel = Pick<
  CommunityModel,
  'name' | 'isActive'
>;

export type UpdateCommunityRequestModel = Pick<
  CommunityModel,
  'id' | 'name' | 'isActive'
>;
