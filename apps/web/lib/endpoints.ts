import { Method } from './types';

export const REGISTER_USER = `REGISTER_USER`;
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
  [CREATE_ORGANIZATION]: {
    requestType: `POST`,
    endpoint: `/api/organization`,
  },
};
