import { Method } from './types';

export const ADD_ENQUIRY = `ADD_ENQUIRY`;
export const REGISTER_USER = `REGISTER_USER`;
export const ADD_ADMISSION = `ADD_ADMISSION`;
export const UPDATE_BRANCH = `UPDATE_BRANCH`;
export const LIST_ADMISSION = `LIST_ADMISSION`;
export const LIST_ENQUIRY = `LIST_ENQUIRY`;
export const ADD_DEPARTMENT = `ADD_DEPARTMENT`;
export const ADD_REGULATION = `ADD_REGULATION`;
export const DELETE_REGULATION = `DELETE_REGULATION`;
export const ADD_COURSE = `ADD_COURSE`;
export const DELETE_COURSE = `DELETE_COURSE`;
export const UPDATE_DEPARTMENT = `UPDATE_DEPARTMENT`;
export const DELETE_DEPARTMENT = `DELETE_DEPARTMENT`;
export const ONBOARD_ACCOUNT = `ONBOARD_ACCOUNT`;
export const UPDATE_ORGANIZATION = `UPDATE_ORGANIZATION`;
export const ADD_PAYMENT = `ADD_PAYMENT`;

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
    endpoint: `/api/department`,
  },
  [UPDATE_DEPARTMENT]: {
    requestType: `PUT`,
    endpoint: `/api/department`,
  },
  [DELETE_DEPARTMENT]: {
    requestType: `DELETE`,
    endpoint: `/api/department`,
  },
  [ADD_REGULATION]: {
    requestType: `POST`,
    endpoint: `/api/regulation`,
  },
  [DELETE_REGULATION]: {
    requestType: `DELETE`,
    endpoint: `/api/regulation`,
  },
  [ADD_COURSE]: {
    requestType: `POST`,
    endpoint: `/api/course`,
  },
  [DELETE_COURSE]: {
    requestType: `DELETE`,
    endpoint: `/api/course`,
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
  [ADD_PAYMENT]: {
    requestType: `POST`,
    endpoint: `/api/payment`,
  },
};
