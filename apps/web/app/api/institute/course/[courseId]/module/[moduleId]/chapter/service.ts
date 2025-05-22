import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

export const addCourseChapter = async (moduleId, payload) => {
  const session = await getServerSession(authOptions);
  const { name, icon, description, isActive, chapterId } = payload;

  const chapterData = chapterId
    ? {
        connectOrCreate: {
          where: {
            id: chapterId,
          },
          create: {
            name,
            icon: icon ?? '',
            description,
            isActive,
            createdById: session.user.id,
          },
        },
      }
    : {
        create: {
          name,
          icon: icon ?? '',
          description,
          isActive,
          createdById: session.user.id,
        },
      };
  return await db.instituteCourseModule.update({
    where: {
      id: moduleId,
    },
    data: {
      chapters: {
        ...chapterData,
      },
    },
  });
};

export const updateCourseChapter = async (chapterId, payload) => {
  const { name, description, isActive } = payload;

  return await db.instituteCourseChapter.update({
    where: {
      id: chapterId,
    },
    data: {
      name,
      description,
      isActive,
    },
  });
};

export const getChapterDetailById = async (chapterId: string) => {
  return await db.instituteCourseChapter.findUnique({
    where: {
      id: chapterId,
    },
  });
};
