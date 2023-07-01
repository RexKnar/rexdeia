import endpointInfo from './endpoints';

export async function makeAPICall<T>(
  apiName: string,
  payload: Record<string, unknown>,
  params: Record<string, string> = {},
  substitutions: Record<string, string> = {},
): Promise<T> {
  let { endpoint, requestType } = endpointInfo[apiName];

  Object.keys(substitutions).forEach((key) => {
    const substitution = substitutions[key];
    endpoint = endpoint.replace(`:${key}`, substitution);
  });

  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  const body = JSON.stringify(payload);

  const response = await fetch(url.toString(), {
    method: requestType,
    body: requestType.toUpperCase() === 'GET' ? null : body,
  });

  if (!response.ok) {
    throw new Error('API call failed');
  }

  return response.json() as Promise<T>;
}