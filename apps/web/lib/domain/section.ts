export type SectionModel = {
  Section: string[];
  id: string;
  name: string;
  isActive: boolean;
  description?: string;
  medium: string;
  classId: string;
  faculty: string;
  department: string;
  subjects: string[];
  staffs: string[];
  students: string[];
};

export type CreateSectionModel = Pick<
  SectionModel,
  'name' | 'isActive' | 'medium' | 'classId' | 'department'
>;

export type UpdateSectionModel = Pick<
  SectionModel,
  | 'name'
  | 'isActive'
  | 'medium'
  | 'classId'
  | 'faculty'
  | 'subjects'
  | 'staffs'
  | 'students'
  | 'description'
>;
