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
  createdAt?: Date;
  updatedAt?: Date;
}

export type CreateRangeScale = Pick<
  RangeScaleModel,
  'startValue' | 'endValue' | 'order' | 'rangeOf'
>;

export type GetRangeScales = Omit<RangeScaleModel, 'createdAt' | 'updatedAt'>;
