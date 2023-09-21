import { Method } from './types';

export const ADD_ENQUIRY = `ADD_ENQUIRY`;
export const REGISTER_USER = `REGISTER_USER`;
export const ADD_ADMISSION = `ADD_ADMISSION`;
export const UPDATE_BRANCH = `UPDATE_BRANCH`;
export const LIST_ADMISSION = `LIST_ADMISSION`;
export const LIST_ENQUIRY = `LIST_ENQUIRY`;
export const LIST_DEPARTMENT = `LIST_DEPARTMENT`;
export const ADD_DEPARTMENT = `ADD_DEPARTMENT`;
export const GET_DEPARTMENT = `GET_DEPARTMENT`;
export const UPDATE_DEPARTMENT = `UPDATE_DEPARTMENT`;
export const DELETE_DEPARTMENT = `DELETE_DEPARTMENT`;
export const LIST_REGULATION = `LIST_REGULATION`;
export const LIST_COURSE = `LIST_COURSE`;
export const ONBOARD_ACCOUNT = `ONBOARD_ACCOUNT`;
export const UPDATE_ORGANIZATION = `UPDATE_ORGANIZATION`;

type EndpointDetails = Record<
  string,
  { requestType: Method; endpoint: string }
>;

export default <EndpointDetails>{
  [REGISTER_USER]: {
    requestType: `POST`,
    endpoint: `/api/register`,
  },
  [ADD_ADMISSION]: {
    requestType: `POST`,
    endpoint: `/api/admission`,
  },
  [LIST_ADMISSION]: {
    requestType: `GET`,
    endpoint: `/api/admissionlist`,
  },
  [ADD_ENQUIRY]: {
    requestType: `POST`,
    endpoint: `/api/enquiry`,
  },
  [LIST_ENQUIRY]: {
    requestType: `POST`,
    endpoint: `/api/enquiryList`,
  },
  [ADD_DEPARTMENT]: {
    requestType: `POST`,
    endpoint: `/api/departmentPost`,
  },
  [LIST_DEPARTMENT]: {
    requestType: `GET`,
    endpoint: `/api/departmentListGet`,
  },
  [UPDATE_DEPARTMENT]: {
    requestType: `PUT`,
    endpoint: `/api/departmentPut`,
  },
  [GET_DEPARTMENT]: {
    requestType: `POST`,
    endpoint: `/api/departmentGet`,
  },
  [DELETE_DEPARTMENT]: {
    requestType: `DELETE`,
    endpoint: `/api/departmentDelete`,
  }, 
  [LIST_REGULATION]: {
    requestType: `GET`,
    endpoint: `/api/regulationListGet`,
  },
  [LIST_COURSE]: {
    requestType: `GET`,
    endpoint: `/api/courseListGet`,
  },
  [ONBOARD_ACCOUNT]: {
    requestType: `POST`,
    endpoint: `/api/onboarding/account`,
  },
  [UPDATE_ORGANIZATION]: {
    requestType: `PUT`,
    endpoint: `/api/organization/[organizationId]`,
  },
  [UPDATE_BRANCH]: {
    requestType: `PUT`,
    endpoint: `/api/branch/[branchId]`,
  },
};
