import { EndpointDetails } from './types';

export const EXAM_ANALYTICS = `EXAM_ANALYTICS`;
export const EXAM_SUBJECTS_BY_CLASS_SECTION_EXAM_ID = `EXAM_SUBJECTS_BY_CLASS_SECTION_EXAM_ID`;
export const EXAM_SUBJECT_MASTER_BY_CLASS_SECTION_EXAM_ID = `EXAM_SUBJECT_MASTER_BY_CLASS_SECTION_EXAM_ID`;
export const EXAM_MARK_LIST_BY_FILTER = `EXAM_MARK_LIST_BY_FILTER`;
export const EXAM_MARK_MASTER_BY_FILTER = `EXAM_MARK_MASTER_BY_FILTER`;
export const EXAM_MARK_LIST_BY_STUDENT_ID = `EXAM_MARK_LIST_BY_STUDENT_ID`;
export const EXAM_ANALYTICS_SECTION_MASTER = `EXAM_ANALYTICS_SECTION_MASTER`;
export const EXAM_ANALYTICS_STAFF_MASTER = `EXAM_ANALYTICS_STAFF_MASTER`;
export const GET_RANGE_SCALES = `GET_RANGE_SCALES`;
export const GET_RANGE_SCALES_BY_ID = `GET_RANGE_SCALES_BY_ID`;
export const ADD_RANGE_SCALES = `ADD_RANGE_SCALES`;
export const DELETE_RANGE_BY_ID = `DELETE_RANGE_BY_ID`;
export default <EndpointDetails>{
  [EXAM_ANALYTICS]: {
    requestType: `PUT`,
    endpoint: `/api/analytics/exams/`,
  },
  [EXAM_ANALYTICS_SECTION_MASTER]: {
    requestType: `PUT`,
    endpoint: `/api/analytics/master/comparison`,
  },
  [EXAM_ANALYTICS_STAFF_MASTER]: {
    requestType: `PUT`,
    endpoint: `/api/analytics/master/comparison/staff`,
  },
  [EXAM_SUBJECTS_BY_CLASS_SECTION_EXAM_ID]: {
    requestType: `GET`,
    endpoint: `/api/exam/[id]/subject/`,
  },
  [EXAM_SUBJECT_MASTER_BY_CLASS_SECTION_EXAM_ID]: {
    requestType: `PUT`,
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
  [EXAM_MARK_LIST_BY_STUDENT_ID]: {
    requestType: `GET`,
    endpoint: `/api/analytics/students/[id]`,
  },
  [ADD_RANGE_SCALES]: {
    requestType: `POST`,
    endpoint: `/api/analytics/range`,
  },
  [GET_RANGE_SCALES]: {
    requestType: `GET`,
    endpoint: `/api/analytics/range`,
  },
  [GET_RANGE_SCALES_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/analytics/range/[id]`,
  },
  [DELETE_RANGE_BY_ID]: {
    requestType: `DELETE`,
    endpoint: '/api/analytics/range/[id]',
  },
};
