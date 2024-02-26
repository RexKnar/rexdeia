import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

/**
 * Custom hook to manage query parameters in a Next.js application.
 * Provides methods to get, set, and remove query parameters.
 *
 * @returns {Object} An object containing methods to manage query parameters.
 */
export function useQueryParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * Get the current query parameters as an object.
   *
   * @returns {Object} An object representing the current query parameters.
   */
  const getParam = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams);
      return params.get(key);
    },
    [searchParams]
  );

  /**
   * Set the query parameters.
   * This will replace the current query parameters with the provided ones.
   *
   * @param {Object} params - An object representing the query parameters to set.
   * @example
   * setParams({ isFlyoutOpen: 'true' });
   */
  const setParams = useCallback(
    (params: Record<string, string>) => {
      const urlSearchParams = new URLSearchParams(params);
      Object.entries(params).forEach(([key, value]) => {
        urlSearchParams.set(key, value);
      });
      router.replace(`?${urlSearchParams.toString()}`);
    },
    [router]
  );

  /**
   * Remove a specific query parameter.
   *
   * @param {string} param - The name of the query parameter to remove.
   */
  const removeParam = useCallback(
    (param: string) => {
      const urlSearchParams = new URLSearchParams(searchParams);
      urlSearchParams.delete(param);
      router.replace(`?${urlSearchParams.toString()}`);
    },
    [router, searchParams]
  );

  /**
   * Remove multiple query parameters.
   *
   * @param {string[]} params - An array of query parameters to remove.
   */
  const removeParams = useCallback(
    (params: string[]) => {
      const urlSearchParams = new URLSearchParams(searchParams);
      params.forEach((param) => {
        urlSearchParams.delete(param);
      });
      router.replace(`?${urlSearchParams.toString()}`);
    },
    [router, searchParams]
  );

  return {
    getParam,
    setParams,
    removeParam,
    removeParams,
  };
}
