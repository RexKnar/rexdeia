import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

export const addCourseModule = async (courseId, payload) => {
  const session = await getServerSession(authOptions);
  const { name, icon, description, isActive } = payload;

  return await db.instituteCourseModule.create({
    data: {
      name,
      isActive,
      description,
      icon,
      createdById: session.user.id,
      instituteCourse: {
        connect: {
          id: courseId,
        },
      },
      branch: {
        connect: {
          id: session.branchId,
        },
      },
    },
  });
};

export const addCourseChapter = async (moduleId, payload) => {
  const session = await getServerSession(authOptions);
  const { name, icon, description, isActive } = payload;

  return await db.instituteCourseModule.create({
    data: {
      name,
      isActive,
      description,
      icon,
      createdById: session.user.id,
      instituteCourse: {
        connect: {
          id: moduleId,
        },
      },
      branch: {
        connect: {
          id: session.branchId,
        },
      },
    },
  });
};

export const getModulesByCourseId = async (courseId, payload) => {
  const session = await getServerSession(authOptions);
  const { isActive } = payload;
  const whereClause = {
    isDeleted: false,
    branchId: session.branchId,
    instituteCourseId: courseId,
  };

  if (isActive !== undefined) {
    whereClause['isActive'] = isActive;
  }

  return await db.instituteCourseModule.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      icon: true,
      description: true,
      isActive: true,
      instituteCourseId: true,
      createdAt: true,
      updatedAt: true,
      createdById: true,
    },
  });
};

export const updateCourseModule = async (moduleId, payload) => {
  const { name, description, isActive } = payload;

  return await db.instituteCourseModule.update({
    where: {
      id: moduleId,
    },
    data: {
      name,
      description,
      isActive,
    },
  });
};

export const getModuleDetailById = async (moduleId: string) => {
  return await db.instituteCourseModule.findUnique({
    where: {
      id: moduleId,
    },
  });
};
