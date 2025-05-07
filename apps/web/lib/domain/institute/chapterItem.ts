import { LanguageModel } from '../language';

export type InstituteCourseChapterItemModel = {
  id: string;
  name: string;
  icon?: string;
  itemType?: string;
  textContent?: {
    id: string;
    type: string;
    level?: number;
    content: string;
    style?: string;
    src?: string;
    alt?: string;
    items?: string[];
  }[];
  pdfUrl?: string;
  videoUrl?: string;
  youtubeUrl?: string;
  vimeoUrl?: string;
  imageUrl?: string;
  description?: string;
  languageId: string;
  language?: LanguageModel;
  chapterId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  createdById: string;
  expanded?: boolean;
  branchId?: string;
};

export type CreateCourseChapterItemRequestModel = Pick<
  InstituteCourseChapterItemModel,
  | 'name'
  | 'icon'
  | 'description'
  | 'languageId'
  | 'branchId'
  | 'chapterId'
  | 'itemType'
>;

export type UpdateCourseChapterItemRequestModel = Pick<
  InstituteCourseChapterItemModel,
  | 'name'
  | 'icon'
  | 'description'
  | 'languageId'
  | 'textContent'
  | 'pdfUrl'
  | 'videoUrl'
  | 'youtubeUrl'
  | 'vimeoUrl'
  | 'imageUrl'
>;
