export type SubjectModel = {
  id: string;
  name: string;
  isActive: boolean;
  description?: string;
  sectionId: string;
  subjectTypeId: string;
  subjectFormatId: string[];
  groupId: string[];
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
  | 'subjectFormatId'
  | 'groupId'
>;

export type UpdateSubjectModel = Pick<
  SubjectModel,
  'name' | 'isActive' | 'description' | 'subjectTypeId' | 'id'
>;

export type SubjectTypeModel = {
  id: string;
  name: string;
  isActive: boolean;
  branchId: string;
  isDeleting?: boolean;
  isUpdating?: boolean;
  isNewlyAdded?: boolean;
};

export type CreateSubjectTypeModel = Pick<
  SubjectTypeModel,
  'name' | 'isActive'
>;

export type UpdateSubjectTypeModel = Pick<
  SubjectTypeModel,
  'name' | 'isActive' | 'id'
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
