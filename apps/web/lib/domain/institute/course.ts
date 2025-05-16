export type CourseCategoryModel = {
  id: string;
  name: string;
  icon: string;
  courseCategoryId: string;
  parentCourseCategory: CourseCategoryModel;
  childCourseCategories: CourseCategoryModel[];
  isActive: boolean;
};

export type InstituteCourseHighlightModel = {
  id: string;
  keyHighlight: string;
  description: string;
  instituteCourseId: string;
  instituteCourse: InstituteCourseModel;
};

export type InstituteCourseOutcomeModel = {
  id: string;
  title: string;
  description: string;
  icon: string;
  instituteCourseId: string;
  instituteCourse: InstituteCourseModel;
};

export type InstituteCourseFAQModel = {
  id: string;
  question: string;
  answer: string;
  instituteCourseId: string;
  instituteCourse: InstituteCourseModel;
};

export type InstituteCourseModel = {
  id: string;
  courseName: string;
  description?: string;
  tagLine?: string;
  languageId: string;
  price: string;
  discountPrice: string;
  order?: number;
  coverImage?: string;
  CourseCategory?: CourseCategoryModel[];
  isActive?: boolean;
  isDeleted?: boolean;
  branchId?: string;
  createdAt?: string;
  updatedAt?: string;
  organizationId?: string;
  InstituteCourseHighlight?: InstituteCourseHighlightModel[];
  InstituteCourseOutcome?: InstituteCourseOutcomeModel[];
  InstituteCourseFAQ?: InstituteCourseFAQModel[];
};

export type CreateCourseRequestModel = Pick<
  InstituteCourseModel,
  | 'courseName'
  | 'description'
  | 'tagLine'
  | 'languageId'
  | 'price'
  | 'discountPrice'
  | 'order'
  | 'coverImage'
  | 'isActive'
  | 'branchId'
  | 'organizationId'
>;

export type UpdateInstituteCourseRequestModel = Pick<
  InstituteCourseModel,
  | 'courseName'
  | 'description'
  | 'tagLine'
  | 'languageId'
  | 'price'
  | 'discountPrice'
  | 'order'
  | 'coverImage'
  | 'isActive'
>;

export type CreateCourseFAQRequestModel = Pick<
  InstituteCourseFAQModel,
  'question' | 'answer' | 'instituteCourseId'
>;

export type updateCourseFAQRequestModel = Pick<
  InstituteCourseFAQModel,
  'id' | 'question' | 'answer' | 'instituteCourseId'
>;
