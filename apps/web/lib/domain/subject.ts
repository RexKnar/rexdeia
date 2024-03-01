export type SubjectModel = {
  id: string;
  name?: string;
  isActive?: boolean;
  description?: string;
  sectionId: string[];
  elective: string;
  sectionIds: string[];
  subjectTypeId: string;
  subjectFormatIds: string[];
  groupIds: string[];
  categoryIds: string[];
  regulationId: string;
  isDeleting?: boolean;
  isUpdating?: boolean;
  isNewlyAdded?: boolean;
  SubjectType?: SubjectTypeModel;
  SubjectFormat: SubjectFormatModel[];
};

export type CreateSubjectModel = Pick<
  SubjectModel,
  | 'name'
  | 'isActive'
  | 'description'
  | 'subjectTypeId'
  | 'subjectFormatIds'
  | 'groupIds'
  | 'elective'
  | 'categoryIds'
  | 'regulationId'
>;

export type UpdateSubjectModel = Pick<
  SubjectModel,
  'name' | 'isActive' | 'description' | 'subjectTypeId' | 'id'
>;

export type SubjectTypeModel = {
  id: string;
  name: string;
  parentId?: string;
  isActive: boolean;
  branchId: string;
  isDeleting?: boolean;
  isUpdating?: boolean;
  isNewlyAdded?: boolean;
};

export type CreateSubjectTypeModel = Pick<
  SubjectTypeModel,
  'name' | 'isActive' | 'parentId'
>;

export type UpdateSubjectTypeMode = Pick<
  SubjectTypeModel,
  'id' | 'name' | 'isActive' | 'parentId'
>;

export type SubjectFormatModel = {
  id: string;
  name: string;
  isActive: boolean;
  branchId: string;
  isDeleting?: boolean;
  isUpdating?: boolean;
  isNewlyAdded?: boolean;
};

export type CreateSubjectFormatModel = Pick<
  SubjectFormatModel,
  'name' | 'isActive'
>;

export type UpdateSubjectFormatModel = Pick<
  SubjectFormatModel,
  'name' | 'isActive' | 'id'
>;
