export type MediumModel = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isDeleting?: boolean;
  isUpdating?: boolean;
  isNewlyAdded?: boolean;
};

export type CreateMediumRequestModel = Pick<MediumModel, 'name' | 'isActive'>;

export type UpdateMediumRequestModel = Pick<
  MediumModel,
  'id' | 'name' | 'isActive'
>;
