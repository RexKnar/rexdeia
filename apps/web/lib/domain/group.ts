export type GroupModel = {
  id: string;
  name: string;
  isActive: boolean;
  students?: string[];
  description?: string;
  isDeleting?: boolean;
  isUpdating?: boolean;
  isNewlyAdded?: boolean;
};

export type CreateMediumModel = Pick<
  GroupModel,
  'name' | 'isActive' | 'description'
>;

export type UpdateMediumModel = Pick<
  GroupModel,
  'id' | 'name' | 'isActive' | 'description'
>;
