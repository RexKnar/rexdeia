import endpointInfo from './endpoints';

export async function makeAPICall<T>(
  apiName: string,
  payload: Record<string, unknown> = {},
  params: Record<string, string | number> = {},
  substitutions: Record<string, string> = {}
): Promise<T> {
  let { endpoint, requestType } = endpointInfo[apiName];

  Object.keys(substitutions).forEach((key) => {
    const substitution = substitutions[key];
    endpoint = endpoint.replace(`[${key}]`, substitution);
  });

  const url = new URL(`${window.location.origin}${endpoint}`);
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key].toString())
  );

  const body = JSON.stringify(payload);

  const response = await fetch(url.toString(), {
    method: requestType,
    body: requestType.toUpperCase() === 'GET' ? null : body,
  });

  if (!response.ok) {
    const error = await response.json();
    return Promise.reject(error);
  }
  return response.json() as Promise<T>;
}
