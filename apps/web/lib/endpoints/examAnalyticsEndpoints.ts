import { EndpointDetails } from './types';

export const EXAM_ANALYTICS = `EXAM_ANALYTICS`;
export const EXAM_SUBJECTS_BY_CLASS_SECTION_EXAM_ID = `EXAM_SUBJECTS_BY_CLASS_SECTION_EXAM_ID`;
export default <EndpointDetails>{
  [EXAM_ANALYTICS]: {
    requestType: `PUT`,
    endpoint: `/api/analytics/exams/`,
  },
  [EXAM_SUBJECTS_BY_CLASS_SECTION_EXAM_ID]: {
    requestType: `GET`,
    endpoint: `/api/exam/[id]/subject/`,
  },
};
