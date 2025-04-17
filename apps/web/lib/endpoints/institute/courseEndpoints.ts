import { EndpointDetails } from '../types';

export const CREATE_INSTITUTE_COURSE = `CREATE_INSTITUTE_COURSE`;
export const INSTITUTE_COURSE_LIST = `INSTITUTE_COURSE_LIST`;

export default <EndpointDetails>{
  [CREATE_INSTITUTE_COURSE]: {
    requestType: `POST`,
    endpoint: `/api/institute/course`,
  },
  [INSTITUTE_COURSE_LIST]: {
    requestType: `GET`,
    endpoint: `/api/institute/course`,
  },
};
