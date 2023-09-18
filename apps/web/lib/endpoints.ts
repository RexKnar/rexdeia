import { Method } from './types';

export const REGISTER_USER = `REGISTER_USER`;
export const ADD_ADMISSION = `ADD_ADMISSION`;
export const ADD_ENQUIRY = `ADD_ENQUIRY`;
export const LIST_ADMISSION = `LIST_ADMISSION`;
export const LIST_ENQUIRY = `LIST_ENQUIRY`;
export const LIST_DEPARTMENT = `LIST_DEPARTMENT`;
export const ADD_DEPARTMENT = `ADD_DEPARTMENT`;
export const GET_DEPARTMENT = `GET_DEPARTMENT`;
export const UPDATE_DEPARTMENT = `UPDATE_DEPARTMENT`;
export const DELETE_DEPARTMENT = `DELETE_DEPARTMENT`;
export const ONBOARD_ACCOUNT = `ONBOARD_ACCOUNT`;
export const CREATE_ORGANIZATION = `CREATE_ORGANIZATION`;

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
  [ADD_ENQUIRY]: {
    requestType: `POST`,
    endpoint: `/api/enquiry`,
  },
  [ADD_DEPARTMENT]: {
    requestType: `POST`,
    endpoint: `/api/departmentAdd`,
  },
  [LIST_ADMISSION]: {
    requestType: `GET`,
    endpoint: `/api/admissionlist`,
  },
  [LIST_ENQUIRY]: {
    requestType: `POST`,
    endpoint: `/api/enquiryList`,
  },
  [LIST_DEPARTMENT]: {
    requestType: `GET`,
    endpoint: `/api/departmentList`,
  },
  [GET_DEPARTMENT]: {
    requestType: `POST`,
    endpoint: `/api/department`,
  },
  [DELETE_DEPARTMENT]: {
    requestType: `DELETE`,
    endpoint: `/api/departmentDelete`,
  },
  [UPDATE_DEPARTMENT]: {
    requestType: `PUT`,
    endpoint: `/api/departmentEdit`,
  },
  [ONBOARD_ACCOUNT]: {
    requestType: `POST`,
    endpoint: `/api/onboarding/account`,
  },
  [CREATE_ORGANIZATION]: {
    requestType: `POST`,
    endpoint: `/api/organization`,
  },
};
