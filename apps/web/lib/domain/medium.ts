export type MediumModel = {
  id: string;
  name: string;
  isActive: boolean;
  isDeleting?: boolean;
  isUpdating?: boolean;
  isNewlyAdded?: boolean;
};

export type CreateMediumModel = Pick<MediumModel, 'name' | 'isActive'>;

export type UpdateMediumModel = Pick<MediumModel, 'id' | 'name' | 'isActive'>;
