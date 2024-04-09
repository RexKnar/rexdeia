export type TermModel = {
  id: string;
  name: string;
  isActive: boolean;
  isDeleting?: boolean;
  isUpdating?: boolean;
  isNewlyAdded?: boolean;
};

export type CreateTermModel = Pick<TermModel, 'name' | 'isActive'>;

export type UpdateTermModel = Pick<TermModel, 'id' | 'name' | 'isActive'>;
