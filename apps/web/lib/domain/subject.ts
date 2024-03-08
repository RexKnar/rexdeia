export type SubjectModel = {
  id: string;
  name?: string;
  isActive?: boolean;
  description?: string;
  sectionId: string[];
  elective: string;
  sectionIds: string[];
  subjectTypeId: string;
  assessmentFormatIds: string[];
  groupIds: string[];
  regulationId: string;
  isDeleting?: boolean;
  isUpdating?: boolean;
  isNewlyAdded?: boolean;
  SubjectType?: SubjectTypeModel;
  assessmentFormat: AssessmentFormatModel[];
  subjectToAssessmentFormat: string[];
};

export type CreateSubjectModel = Pick<
  SubjectModel,
  | 'name'
  | 'isActive'
  | 'description'
  | 'subjectTypeId'
  | 'assessmentFormatIds'
  | 'groupIds'
  | 'elective'
  | 'regulationId'
>;

export type UpdateSubjectModel = Pick<
  SubjectModel,
  'name' | 'isActive' | 'description' | 'subjectTypeId' | 'id'
>;

export type AssessmentFormatModel = {
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

export type CreateAssessmentFormatModel = Pick<
  AssessmentFormatModel,
  'name' | 'isActive' | 'parentId' | 'hasMarkEntry'
>;

export type UpdateAssessmentFormatModel = Pick<
  AssessmentFormatModel,
  'id' | 'name' | 'isActive' | 'parentId' | 'hasMarkEntry'
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
