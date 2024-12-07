import { EndpointDetails } from './types';

export const ASSIGN_ELECTIVE_SUBJECTS = `ASSIGN_ELECTIVE_SUBJECTS`;
export const GET_ANALYTICS_SUBJECTS_BY_STAFF = `GET_ANALYTICS_SUBJECTS_BY_STAFF`;
export default <EndpointDetails>{
  [ASSIGN_ELECTIVE_SUBJECTS]: {
    requestType: `POST`,
    endpoint: `/api/subject/[id]/assign-elective`,
  },
  [GET_ANALYTICS_SUBJECTS_BY_STAFF]: {
    requestType: `get`,
    endpoint: `/api/staff/[id]/analytics/subjects`,
  },
};
