import { Method } from './types';

export const REGISTER_USER = `REGISTER_USER`;
export const ADD_ADMISSION = `ADD_ADMISSION`;
export const ADD_ENQUIRY = `ADD_ENQUIRY`;
export const LIST_ADMISSION = `LIST_ADMISSION`;
export const LIST_ENQUIRY = `LIST_ENQUIRY`;
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
  [LIST_ADMISSION]: {
    requestType: `GET`,
    endpoint: `/api/admissionlist`,
  },
  [LIST_ENQUIRY]: {
    requestType: `POST`,
    endpoint: `/api/enquiryList`,
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
