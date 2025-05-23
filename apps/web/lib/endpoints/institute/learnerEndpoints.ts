import { EndpointDetails } from '../types';

export const ASSIGN_LEARNER = '/api/learners/assign';

export default <EndpointDetails>{
  [ASSIGN_LEARNER]: {
    requestType: `POST`,
    endpoint: `/api/institute/learner/assign`,
  },
};
