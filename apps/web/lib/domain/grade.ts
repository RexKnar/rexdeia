export type GradeModel = {
  id: string;
  name: string;
  isActive: boolean;
  gradeScales: AddGradeScalesModel[];
  isDeleting?: boolean;
  isUpdating?: boolean;
  isNewlyAdded?: boolean;
};

export type GetGrade = {
  name: string;
  isActive: boolean;
  gradeScales: AddGradeScalesModel[];
};

export type AddGradeModel = Pick<
  GradeModel,
  'name' | 'isActive' | 'gradeScales'
>;

export type AddGradeScaleModel = Pick<GradeModel, 'id'> & {
  gradeScales: AddGradeScalesModel[];
};

export type UpdateGradeModel = Pick<GradeModel, 'id' | 'name' | 'isActive'> & {
  gradeScales: AddGradeScalesModel[];
};

export type gradeScales = {
  name: string;
  id: string;
  startValue: string;
  endValue: string;
  gradeName: string;
  gradeId?: string;
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
