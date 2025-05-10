import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

export const addChapterItem = async (chapterId, payload) => {
  const session = await getServerSession(authOptions);
  const { name, icon, description, itemType } = payload;

  return await db.instituteCourseChapterItem.create({
    data: {
      name,
      icon,
      description,
      itemType: itemType,
      createdById: session.user.id,
      chapter: {
        connect: {
          id: chapterId,
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
