export type SubjectModel = {
  id: string;
  name: string;
  isActive: boolean;
  description?: string;
  sectionId: string;
  type: string;
};

export type CreateSubjectModel = Pick<
  SubjectModel,
  'name' | 'isActive' | 'description' | 'type'
>;

export type UpdateSubjectModel = Pick<
  SubjectModel,
  'name' | 'isActive' | 'description' | 'type'
>;
