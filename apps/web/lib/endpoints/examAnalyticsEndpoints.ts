import { EndpointDetails } from './types';

export const EXAM_ANALYTICS = `EXAM_ANALYTICS`;
export const EXAM_SUBJECTS_BY_CLASS_SECTION_EXAM_ID = `EXAM_SUBJECTS_BY_CLASS_SECTION_EXAM_ID`;
export const EXAM_MARK_LIST_BY_FILTER = `EXAM_MARK_LIST_BY_FILTER`;
export const EXAM_MARK_MASTER_BY_FILTER = `EXAM_MARK_MASTER_BY_FILTER`;
export const EXAM_ANALYTICS_SECTION_MASTER = `EXAM_ANALYTICS_SECTION_MASTER`;
export default <EndpointDetails>{
  [EXAM_ANALYTICS]: {
    requestType: `PUT`,
    endpoint: `/api/analytics/exams/`,
  },
  [EXAM_ANALYTICS_SECTION_MASTER]: {
    requestType: `PUT`,
    endpoint: `/api/analytics/master/comparison`,
  },
  [EXAM_SUBJECTS_BY_CLASS_SECTION_EXAM_ID]: {
    requestType: `GET`,
    endpoint: `/api/exam/[id]/subject/`,
  },
  [EXAM_MARK_LIST_BY_FILTER]: {
    requestType: `PUT`,
    endpoint: `/api/analytics/marks`,
  },
  [EXAM_MARK_MASTER_BY_FILTER]: {
    requestType: `PUT`,
    endpoint: `/api/analytics/master`,
  },
};
