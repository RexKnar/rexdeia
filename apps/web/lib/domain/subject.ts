export type SubjectModel = {
  subject: SubjectModel[];
  id: string;
  name?: string;
  isActive?: boolean;
  description?: string;
  subjectMasterId: string;
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
  | 'subjectMasterId'
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

export type DeleteAssessmentFormatModel = Pick<AssessmentFormatModel, 'id'>;

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

export type SubjectMasterModel = {
  id: string;
  name: string;
  isActive: boolean;
  subject: SubjectModel[];
  branchId: string;
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
