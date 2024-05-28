import { EndpointDetails } from './types';

export const EXAM_ANALYTICS = `EXAM_ANALYTICS`;
export default <EndpointDetails>{
  [EXAM_ANALYTICS]: {
    requestType: `PUT`,
    endpoint: `/api/analytics/exams/`,
  },
};
