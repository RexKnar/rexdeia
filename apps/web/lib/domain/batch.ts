import { PeriodMasterModel } from './periodMaster';

export type BatchModel = {
  id: string;
  name: string;
  endYear: string;
  isActive: boolean;
  currentAcademicYear: boolean;
  classes: string[];
  startYear: string;
  students?: string[];
  description?: string;
  isDeleting?: boolean;
  isUpdating?: boolean;
  isNewlyAdded?: boolean;
  periodMaster: PeriodMasterModel[];
};

export type CreateBatchModel = Pick;

export type UpdateBatchModel = Pick;
