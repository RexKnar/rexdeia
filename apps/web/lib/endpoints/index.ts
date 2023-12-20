import { EndpointDetails } from './types';

export const ADD_ENQUIRY = `ADD_ENQUIRY`;
export const REGISTER_USER = `REGISTER_USER`;
export const ADD_ADMISSION = `ADD_ADMISSION`;
export const UPDATE_BRANCH = `UPDATE_BRANCH`;
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
export const FETCH_ORGANIZATION_BY_ID = `FETCH_ORGANIZATION_BY_ID`;
export const ADD_PAYMENT = `ADD_PAYMENT`;
export const ADD_STUDENT = `ADD_STUDENT`;
export const GET_USER_DETAILS = `GET_USER_DETAILS`;
export const GET_ADMISSIONS_LIST = `GET_ADMISSIONS_LIST`;
export const GET_ADMISSIONS_FORM_SHARE_DETAILS = `GET_ADMISSIONS_FORM_SHARE_DETAILS`;
export const CREATE_SHARE_FOR_FORM = `CREATE_SHARE_FOR_FORM`;
export const UPDATE_SHARE_FOR_FORM = `UPDATE_SHARE_FOR_FORM`;
export const GET_STUDENTS_LIST = `GET_STUDENTS_LIST`;
export const ADD_CLASS = `ADD_CLASS`;
export const GET_CLASS = `GET_CLASS`;
export const GET_REGULATION_LIST = `GET_REGULATION_LIST`;
export const GET_REGULATION_BY_ID = `GET_REGULATION_BY_ID`;
export const UPDATE_REGULATION_BY_ID = `UPDATE_REGULATION_BY_ID`;

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
  [FETCH_ORGANIZATION_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/organization/[organizationId]`,
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
  [ADD_STUDENT]: {
    requestType: `POST`,
    endpoint: `/api/student`,
  },
  [GET_USER_DETAILS]: {
    requestType: `GET`,
    endpoint: `/api/user`,
  },
  [GET_ADMISSIONS_LIST]: {
    requestType: `GET`,
    endpoint: `/api/admission`,
  },
  [GET_ADMISSIONS_FORM_SHARE_DETAILS]: {
    requestType: `GET`,
    endpoint: `/api/forms/[formId]/share`,
  },
  [CREATE_SHARE_FOR_FORM]: {
    requestType: `POST`,
    endpoint: `/api/share`,
  },
  [UPDATE_SHARE_FOR_FORM]: {
    requestType: `PUT`,
    endpoint: `/api/share/[shareId]`,
  },
  [GET_STUDENTS_LIST]: {
    requestType: `GET`,
    endpoint: `/api/student`,
  },
  [ADD_CLASS]: {
    requestType: `POST`,
    endpoint: `/api/class`,
  },
  [GET_CLASS]: {
    requestType: `GET`,
    endpoint: `/api/class`,
  },
  [GET_REGULATION_LIST]: {
    requestType: `GET`,
    endpoint: `/api/regulation`,
  },
  [GET_REGULATION_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/regulation/[id]`,
  },
  [UPDATE_REGULATION_BY_ID]: {
    requestType: `PUT`,
    endpoint: `/api/regulation/[id]`,
  },
};
