export type SubjectModel = {
  id: string;
  name?: string;
  isActive?: boolean;
  description?: string;
  sectionId: string[];
  elective: string;
  sectionIds: string[];
  subjectTypeIds: string[];
  subjectFormatIds: string[];
  groupIds: string[];
  regulationId: string;
  isDeleting?: boolean;
  isUpdating?: boolean;
  isNewlyAdded?: boolean;
  SubjectType?: SubjectTypeModel;
  SubjectFormat: SubjectFormatModel[];
  subjectToSubjectFormat: string[];
};

export type CreateSubjectModel = Pick<
  SubjectModel,
  | 'name'
  | 'isActive'
  | 'description'
  | 'subjectTypeIds'
  | 'subjectFormatIds'
  | 'groupIds'
  | 'elective'
  | 'regulationId'
>;

export type UpdateSubjectModel = Pick<
  SubjectModel,
  'name' | 'isActive' | 'description' | 'subjectTypeIds' | 'id'
>;

export type SubjectTypeModel = {
  id: string;
  name: string;
  parentId?: string;
  isActive: boolean;
  hasMarkEntry: boolean;
  branchId: string;
  isDeleting?: boolean;
  isUpdating?: boolean;
  isNewlyAdded?: boolean;
};

export type CreateSubjectTypeModel = Pick<
  SubjectTypeModel,
  'name' | 'isActive' | 'parentId' | 'hasMarkEntry'
>;

export type UpdateSubjectTypeModel = Pick<
  SubjectTypeModel,
  'id' | 'name' | 'isActive' | 'parentId' | 'hasMarkEntry'
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
