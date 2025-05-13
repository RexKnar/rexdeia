import { db } from 'lib/db';

export const addCourseFAQ = async (courseId, payload) => {
  const { question, answer } = payload;
  return await db.instituteCourseFAQ.create({
    data: {
      question,
      answer,
      instituteCourse: {
        connect: {
          id: courseId,
        },
      },
    },
  });
};

export const getCourseFAQ = async (courseId: string) => {
  return await db.instituteCourseFAQ.findMany({
    where: {
      instituteCourseId: courseId,
    },
    select: {
      id: true,
      question: true,
      answer: true,
      instituteCourseId: true,
    },
  });
};
