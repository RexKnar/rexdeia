import { EndpointDetails } from './types';

export const ASSIGN_ELECTIVE_SUBJECTS = `ASSIGN_ELECTIVE_SUBJECTS`;
export default <EndpointDetails>{
  [ASSIGN_ELECTIVE_SUBJECTS]: {
    requestType: `POST`,
    endpoint: `/api/subject/[id]/assign-elective`,
  },
};
