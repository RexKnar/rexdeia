export type MediumModel = {
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
  MediumModel,
  'name' | 'isActive' | 'description'
>;

export type UpdateMediumModel = Pick<
  MediumModel,
  'id' | 'name' | 'isActive' | 'description'
>;
