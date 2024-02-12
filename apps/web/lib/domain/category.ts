export type CategoryModel = {
  id: string;
  name: string;
  parent: string;
  isActive: boolean;
  isDeleting?: boolean;
  isUpdating?: boolean;
  isNewlyAdded?: boolean;
};

export type CreateGroupModel = Pick<
  CategoryModel,
  'name' | 'isActive' | 'parent'
>;

export type UpdateCategoryModel = Pick<
  CategoryModel,
  'id' | 'name' | 'isActive' | 'parent'
>;
