export type SubjectModel = {
  id: string;
  name?: string;
  isActive?: boolean;
  description?: string;
  subjectMasterId: string;
  subjectMaster?: SubjectMasterModel;
  sectionId: string[];
  elective: string;
  classId: string;
  sectionIds: string[];
  subjectTypeId: string;
  assessmentFormatIds: string[];
  subjectToGroup: SubjectToGroupModel[];
  groupIds: string[];
  regulationId: string;
  isDeleting?: boolean;
  isUpdating?: boolean;
  isNewlyAdded?: boolean;
  subjectToSubjectTypes: SubjectToSubjectTypesModel[];
  SubjectType?: SubjectTypeModel;
  assessmentFormat: AssessmentFormatModel[];
  subjectToAssessmentFormat: SubjectToAssessmentFormatModel[];
  subjectOrder?: number;
};

export type CreateSubjectModel = Pick;

export type UpdateSubjectModel = Pick;

export type AssessmentFormatModel = {
  assessmentFormat: AssessmentFormatModel;
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

export type CreateAssessmentFormatModel = Pick;

export type UpdateAssessmentFormatModel = Pick;

export type DeleteAssessmentFormatModel = Pick;

export type SubjectTypeModel = {
  id: string;
  name: string;
  isActive: boolean;
  branchId: string;
  isDeleting?: boolean;
  isUpdating?: boolean;
  isNewlyAdded?: boolean;
};

export type CreateSubjectTypeModel = Pick;

export type UpdateSubjectTypeModel = Pick;

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

export type CreateSubjectMasterModel = Pick;

export type UpdateSubjectMasterModel = Pick;

export type SubjectToAssessmentFormatModel = {
  assessmentFormatId: string;
  subjectId: string;
  createdAt: string;
  updatedAt: string;
};

export type SubjectToGroupModel = {
  subjectId: string;
  groupId: string;
  classId: string;
  createdAt: string;
  updatedAt: string;
  subject: SubjectModel;
};

export type SubjectToSubjectTypesModel = {
  subjectId: string;
  subjectTypeId: string;
  createdAt: string;
  updatedAt: string;
  subjectType: string;
};

export type AssignElectiveSubjectModel = {
  sectionId?: string;
  academicYearId?: string;
  subjectId: string;
  studentId: string;
  subjectMasterId: string;
};
