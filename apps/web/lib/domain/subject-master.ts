export type SubjectMasterModel = {
  id: string;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isDeleting?: boolean;
  isUpdating?: boolean;
  isNewlyAdded?: boolean;
};

export type CreateSubjectMasterModel = Pick<
  SubjectMasterModel,
  'name' | 'isActive'
>;

export type UpdateSubjectMasterModel = Pick<
  SubjectMasterModel,
  'id' | 'name' | 'isActive'
>;
