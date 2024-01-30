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
export const ADD_MEDIUM = `ADD_MEDIUM`;
export const GET_CLASS_LIST = `GET_CLASS_LIST`;
export const GET_CLASS_BY_ID = `GET_CLASS_BY_ID`;
export const UPDATE_CLASS_BY_ID = `UPDATE_CLASS_BY_ID`;
export const GET_REGULATION_LIST = `GET_REGULATION_LIST`;
export const GET_REGULATION_BY_ID = `GET_REGULATION_BY_ID`;
export const GET_MEDIUM_BY_ID = `GET_MEDIUM_BY_ID`;
export const UPDATE_REGULATION_BY_ID = `UPDATE_REGULATION_BY_ID`;
export const UPDATE_MEDIUM_BY_ID = `UPDATE_MEDIUM_BY_ID`;
export const GET_GROUP_LIST = `GET_GROUP_LIST`;
export const GET_MEDIUM_LIST = `GET_MEDIUM_LIST`;
export const GET_BATCHES_LIST = `GET_BATCHES_LIST`;
export const CREATE_BATCH = `CREATE_BATCH`;
export const GET_BATCH_BY_ID = `GET_BATCH_BY_ID`;
export const GET_GROUP_BY_ID = `GET_GROUP_BY_ID`;
export const UPDATE_BATCH_BY_ID = `UPDATE_BATCH_BY_ID`;
export const DELETE_BATCH_BY_ID = `DELETE_BATCH_BY_ID`;
export const UPDATE_GROUP_BY_ID = `UPDATE_GROUP_BY_ID`;
export const GET_SUBJECT_LIST = `GET_SUBJECT_LIST`;
export const ADD_SUBJECT = `ADD_SUBJECT`;
export const ADD_GROUP = `ADD_GROUP`;
export const ADD_SECTION = `ADD_SECTION`;
export const GET_SECTION_BY_ID = `GET_SECTION_BY_ID`;
export const DELETE_SUBJECT_BY_ID = `DELETE_SUBJECT_BY_ID`;
export const UPDATE_SUBJECT_BY_ID = `UPDATE_SUBJECT_BY_ID`;
export const GET_SUBJECT_BY_ID = `GET_SUBJECT_BY_ID`;
export const GET_SUBJECT_TYPE_LIST = `GET_SUBJECT_TYPE_LIST`;
export const GET_SUBJECT_FORMAT_LIST = `GET_SUBJECT_FORMAT_LIST`;
export const UPDATE_SECTION_BY_ID = `UPDATE_SECTION_BY_ID`;
export const DELETE_GROUP_BY_ID = `DELETE_GROUP_BY_ID`;
export const DELETE_MEDIUM_BY_ID = `DELETE_MEDIUM_BY_ID`;
export const GET_SUBJECT_LIST_BY_SECTION_ID = `GET_SUBJECT_LIST_BY_SECTION_ID`;
export const DELETE_STUDENT_BY_ID = `DELETE_STUDENT_BY_ID`;
export const ADD_STAFF = `ADD_STAFF`;

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
  [ADD_MEDIUM]: {
    requestType: `POST`,
    endpoint: `/api/medium`,
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
  [ADD_GROUP]: {
    requestType: `POST`,
    endpoint: `/api/group`,
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
  [GET_CLASS_LIST]: {
    requestType: `GET`,
    endpoint: `/api/class`,
  },
  [GET_CLASS_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/class/[id]`,
  },
  [UPDATE_CLASS_BY_ID]: {
    requestType: `PUT`,
    endpoint: `/api/class/[id]`,
  },
  [GET_REGULATION_LIST]: {
    requestType: `GET`,
    endpoint: `/api/regulation`,
  },
  [GET_REGULATION_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/regulation/[id]`,
  },
  [GET_MEDIUM_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/medium/[id]`,
  },
  [GET_GROUP_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/group/[id]`,
  },
  [GET_GROUP_LIST]: {
    requestType: `PUT`,
    endpoint: `/api/group`,
  },
  [GET_MEDIUM_LIST]: {
    requestType: `PUT`,
    endpoint: `/api/medium`,
  },
  [UPDATE_REGULATION_BY_ID]: {
    requestType: `PUT`,
    endpoint: `/api/regulation/[id]`,
  },
  [UPDATE_MEDIUM_BY_ID]: {
    requestType: `PUT`,
    endpoint: `/api/medium/[id]`,
  },
  [UPDATE_GROUP_BY_ID]: {
    requestType: `PUT`,
    endpoint: `/api/group/[id]`,
  },
  [GET_BATCHES_LIST]: {
    requestType: `GET`,
    endpoint: `/api/batch`,
  },
  [CREATE_BATCH]: {
    requestType: `POST`,
    endpoint: `/api/batch`,
  },
  [DELETE_BATCH_BY_ID]: {
    requestType: `DELETE`,
    endpoint: `/api/batch/[id]`,
  },
  [GET_BATCH_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/batch/[id]`,
  },
  [UPDATE_BATCH_BY_ID]: {
    requestType: `PUT`,
    endpoint: `/api/batch/[id]`,
  },
  [ADD_SUBJECT]: {
    requestType: `POST`,
    endpoint: `/api/subject`,
  },
  [GET_SUBJECT_LIST]: {
    requestType: `GET`,
    endpoint: `/api/subject`,
  },
  [GET_SECTION_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/section/[id]`,
  },
  [ADD_SECTION]: {
    requestType: `POST`,
    endpoint: `/api/section`,
  },
  [DELETE_SUBJECT_BY_ID]: {
    requestType: `DELETE`,
    endpoint: `/api/subject/[id]`,
  },
  [UPDATE_SUBJECT_BY_ID]: {
    requestType: `PUT`,
    endpoint: `/api/subject/[id]`,
  },
  [GET_SUBJECT_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/subject/[id]`,
  },
  [UPDATE_SECTION_BY_ID]: {
    requestType: `PUT`,
    endpoint: `/api/section/[id]`,
  },
  [DELETE_GROUP_BY_ID]: {
    requestType: `DELETE`,
    endpoint: `/api/group/[id]`,
  },
  [DELETE_MEDIUM_BY_ID]: {
    requestType: `DELETE`,
    endpoint: `/api/medium/[id]`,
  },
  [GET_SUBJECT_TYPE_LIST]: {
    requestType: `GET`,
    endpoint: `/api/subject/subjectType`,
  },
  [GET_SUBJECT_FORMAT_LIST]: {
    requestType: `GET`,
    endpoint: `/api/subject/subjectFormat`,
  },
  [GET_SUBJECT_LIST_BY_SECTION_ID]: {
    requestType: `GET`,
    endpoint: `/api/section/[id]/subjects`,
  },
  [DELETE_STUDENT_BY_ID]: {
    requestType: `DELETE`,
    endpoint: `/api/student/[id]`,
  },
  [ADD_STAFF]: {
    requestType: `POST`,
    endpoint: `/api/staff/`,
  },
};
