import { BranchModal } from './branch';
import { Staff } from './staff';

export type NatureOfPostingModel = {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  isDeleting?: boolean;
  isUpdating?: boolean;
  isNewlyAdded?: boolean;
  branchId?: string;
  branch?: BranchModal[];
  staff?: Staff[];
};

export type CreateNatureOfPostingRequestModel = Pick<
  NatureOfPostingModel,
  'name' | 'isActive'
>;

export type UpdateNatureOfPostingRequestModel = Pick<
  NatureOfPostingModel,
  'id' | 'name' | 'isActive'
>;
