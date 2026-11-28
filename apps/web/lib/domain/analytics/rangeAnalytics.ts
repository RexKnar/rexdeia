import { RangeType } from '@prisma/client';

import { BatchModel } from '../batch';

export interface RangeScaleModel {
  id: string;
  startValue: string;
  endValue: string;
  order: number;
  batchId: string;
  batch?: BatchModel;
  rangeOf: RangeType;
  classLevelId?: string | null;
  classLevel?: {
    id: string;
    name: string;
  } | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CreateRangeScale = {
  startValue: string;
  endValue: string;
  order: number;
  rangeOf: RangeType;
  classLevelId?: string | null;
};

export type GetRangeScales = RangeScaleModel;
