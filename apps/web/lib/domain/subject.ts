export type SubjectModel = {
  academicSubjectForStaff: AcademicSubjectForStaffModel[];
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
  | 'subjectOrder'
>;

export type UpdateSubjectModel = Pick<
  SubjectModel,
  | 'id'
  | 'name'
  | 'isActive'
  | 'description'
  | 'subjectTypeId'
  | 'assessmentFormatIds'
  | 'groupIds'
  | 'elective'
  | 'regulationId'
  | 'subjectMasterId'
  | 'classId'
  | 'subjectOrder'
>;

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

export type AcademicSubjectForStaffModel = {
  id: string;
  staffId: string;
  subjectId: string;
  academicYearId: string;
  sectionId: string;
  isIncharge: boolean;
  deletedAt: Date;
  staff?: {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
  };
  section?: {
    id: string;
    name: string;
  };
};
