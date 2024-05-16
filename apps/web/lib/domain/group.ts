import { SubjectModel } from './subject';

export type GroupModel = {
  id: string;
  name: string;
  isActive: boolean;
  isDeleting?: boolean;
  isUpdating?: boolean;
  isNewlyAdded?: boolean;
  subject: SubjectModel[];
};

export type CreateGroupModel = Pick<GroupModel, 'name' | 'isActive'>;

export type UpdateGroupModel = Pick<GroupModel, 'id' | 'name' | 'isActive'>;
