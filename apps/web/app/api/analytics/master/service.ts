import { getClassById } from 'app/api/class/service';
import { getExamById } from 'app/api/exam/[id]/service';
import { getSectionById } from 'app/api/section/service';

import { getStudentMarksByFilter, getStudentMarksByRank } from '../service';

type MarkAnalyticsFilter = {
  classId?: string;
  sectionId?: string;
  examId?: string;
  markRange?: string[];
  filterSubjects?: any[];
  pagination: {
    limit: number;
    page: number;
  };
};

export async function getMasterMarksByFilter(filter: MarkAnalyticsFilter) {
  try {
    const classDetails = await getClassById(filter.classId);
    let sectionDetails = null;
    if (filter.sectionId) {
      sectionDetails = await getSectionById(filter.sectionId);
    }
    const examDetails = await getExamById(filter.examId);
    const studentMarkList = await getStudentMarksByFilter(filter);
    const analytics = getAnalytics(studentMarkList);
    const rankedStudentList = await getStudentMarksByRank(studentMarkList);

    return {
      markList: rankedStudentList,
      analytics,
      class: classDetails,
      section: sectionDetails,
      exam: examDetails,
    };
  } catch (error) {
    return { markList: [], analytics: {}, error };
  }
}

function getAnalytics(students) {
  let totalMale = 0;
  let totalFemale = 0;
  let totalCount = students.length || 0;

  students.forEach((student) => {
    const gender = student.gender;

    if (gender.toLowerCase() === 'male') {
      totalMale++;
    } else if (gender.toLowerCase() === 'female') {
      totalFemale++;
    }
  });

  const totalMalePercentage = (totalMale / totalCount) * 100;
  const totalFemalePercentage = (totalFemale / totalCount) * 100;

  return {
    totalCount,
    totalMale,
    totalFemale,
    totalFemalePercentage,
    totalMalePercentage,
  };
}
