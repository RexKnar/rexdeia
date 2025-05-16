import { db } from 'lib/db';

export const updateCourseFAQById = async (id, payload) => {
  return await db.instituteCourseFAQ.update({
    where: {
      id,
    },
    data: {
      question: payload.question,
      answer: payload.answer,
    },
  });
};

export const deleteCourseFAQById = async (id) => {
  return await db.instituteCourseFAQ.delete({
    where: {
      id: id,
    },
  });
};
