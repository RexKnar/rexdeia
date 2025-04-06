import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { db } from '../../../lib/db';
import {
  AddGradeModel,
  AddGradeScaleModel,
  AddGradeScalesModel,
  UpdateGradeModel,
} from '../../../lib/domain/grade';
import { addGradeScale } from '../gradeScales/service';

export async function addGrade(gradePayload: AddGradeModel) {
  const session = await getServerSession(authOptions);
  const createdGrade = await db.grade.create({
    data: {
      name: gradePayload.name,
      isActive: gradePayload.isActive,
      branch: {
        connect: {
          id: session.branchId,
        },
      },
    },
  });

  gradePayload.gradeScales.forEach((gradeScale) => {
    const createGradeScales: AddGradeScalesModel = {
      startValue: gradeScale.startValue,
      endValue: gradeScale.endValue,
      gradeName: gradeScale.gradeName,
      remark: gradeScale.remark,
      gradeId: createdGrade.id,
    };
    addGradeScale(createGradeScales);
  });
  return createdGrade;
}

export async function addGradeScales(gradePayload: AddGradeScaleModel) {
  gradePayload.gradeScales.forEach((gradeScale) => {
    const createGradeScales: AddGradeScalesModel = {
      startValue: gradeScale.startValue,
      endValue: gradeScale.endValue,
      gradeName: gradeScale.gradeName,
      remark: gradeScale.remark,
      gradeId: gradePayload.id,
    };
    addGradeScale(createGradeScales);
  });
  return gradePayload;
}

export async function getAllGradeList(page: number, limit: number) {
  const session = await getServerSession(authOptions);

  const [total, gradeList] = await Promise.all([
    db.grade.count({
      where: {
        branchId: session.branchId,
      },
    }),
    db.grade.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        branchId: session.branchId,
        isDeleted: false,
      },
      include: {
        gradeScales: true,
      },
    }),
  ]);

  return {
    page,
    total,
    limit,
    data: gradeList,
  };
}

export async function updateGradeById(
  id: string,
  updateGrade: UpdateGradeModel
) {
  const session = await getServerSession(authOptions);
  return db.grade.update({
    where: {
      id: id,
      branchId: session.branchId,
    },
    data: {
      name: updateGrade.name,
      isActive: updateGrade.isActive,
    },
  });
}

export async function getGradeById(id: string) {
  const session = await getServerSession(authOptions);
  return db.grade.findFirst({
    where: {
      id: id,
      branchId: session.branchId,
    },
  });
}

export async function deleteGradeById(id: string) {
  const session = await getServerSession(authOptions);
  return db.grade.update({
    where: {
      id: id,
      branchId: session.branchId,
    },
    data: {
      isDeleted: true,
      isActive: false,
      updatedAt: new Date(),
    },
  });
}

export async function deleteGradeScaleById(id: string) {
  return db.gradeScales.delete({
    where: {
      id: id,
    },
  });
}
export async function deleteScaleById(id: string) {
  const session = await getServerSession(authOptions);
  return db.grade.update({
    where: {
      id: id,
      branchId: session.branchId,
    },
    data: {
      isDeleted: true,
      isActive: false,
      updatedAt: new Date(),
    },
  });
}
export async function getGradeByClassId(classId: string) {
  const session = await getServerSession(authOptions);
  const response = await db.class.findUnique({
    where: {
      id: classId,
      branchId: session.branchId,
      isDeleted: false,
    },
    include: {
      grade: {
        include: {
          gradeScales: true,
        },
      },
    },
  });

  return response ? response?.grade : null;
}
