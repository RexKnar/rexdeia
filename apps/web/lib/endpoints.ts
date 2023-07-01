import { Method } from "./types";

export const REGISTER_USER = `REGISTER_USER`;

type EndpointDetails = Record<string, { requestType: Method; endpoint: string }>;

export default <EndpointDetails> {
  [REGISTER_USER] : {
    requestType: `POST`,
    endpoint: `/api/register`,
  }
}