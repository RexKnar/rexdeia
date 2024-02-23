export type GradeModel = {
  id: string;
  name: string;
  isActive: boolean;
  gradeScales: gradeScales[];
  isDeleting?: boolean;
};

export type AddGradeModel = Pick<
  GradeModel,
  'name' | 'isActive' | 'gradeScales'
>;

export type UpdateGradeModel = Pick<GradeModel, 'id' | 'name' | 'isActive'> & {
  gradeScales: AddGradeScalesModel[];
};

export type gradeScales = {
  id: string;
  startValue: string;
  endValue: string;
  gradeName: string;
  gradeId: string;
  remark: string;
  isDeleting?: boolean;
};

export type AddGradeScalesModel = Pick<
  gradeScales,
  'startValue' | 'endValue' | 'gradeName' | 'remark' | 'gradeId'
>;

export type UpdateGradeScalesModel = Pick<
  gradeScales,
  'id' | 'startValue' | 'endValue' | 'gradeName' | 'remark'
>;
