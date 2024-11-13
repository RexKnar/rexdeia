import { languages } from '../../app/api/(utils)/languages/data';

type Language = (typeof languages)[number];
export type GetLanguagesResponse = Language[];

export type LanguageModel = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isDeleting?: boolean;
  isUpdating?: boolean;
  isNewlyAdded?: boolean;
};

export type CreateLanguageRequestModel = Pick;

export type UpdateLanguageRequestModel = Pick;
