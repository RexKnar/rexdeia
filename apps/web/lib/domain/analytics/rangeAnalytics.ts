import { RangeType } from '@prisma/client';

import { BatchModel } from '../batch';

export interface RangeScaleModel {
  id: string;
  startValue: string;
  endValue: string;
  order: number;
  batchId: string;
  batch: BatchModel;
  rangeOf: RangeType;
  classLevelId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CreateRangeScale = Pick<
  RangeScaleModel,
  'startValue' | 'endValue' | 'order' | 'rangeOf' | 'classLevelId'
>;

export type GetRangeScales = Omit<RangeScaleModel, 'createdAt' | 'updatedAt'>;
