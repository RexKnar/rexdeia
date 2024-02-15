export type CategoryModel = {
  id: string;
  name: string;
  parentId?: string;
  isActive: boolean;
  isDeleting?: boolean;
  isUpdating?: boolean;
  isNewlyAdded?: boolean;
};

export type CreateCategoryModel = Pick<
  CategoryModel,
  'name' | 'isActive' | 'parentId'
>;

export type UpdateCategoryModel = Pick<
  CategoryModel,
  'id' | 'name' | 'isActive' | 'parentId'
>;
