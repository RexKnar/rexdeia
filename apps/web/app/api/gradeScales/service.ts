import { db } from '../../../lib/db';
import { AddGradeScalesModel } from '../../../lib/domain/grade';

export async function addGradeScale(GradeScalesPayload: AddGradeScalesModel) {
  return db.gradeScales.create({
    data: {
      startValue: GradeScalesPayload.startValue,
      endValue: GradeScalesPayload.endValue,
      gradeName: GradeScalesPayload.gradeName,
      remark: GradeScalesPayload.remark,
      gradeId: GradeScalesPayload.gradeId,
    },
  });
}
