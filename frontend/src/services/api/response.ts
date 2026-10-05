import { ApiResponse } from '@/types/api/common';

export function normalizeResponse<T>(json: any): T {
  if (json && typeof json === 'object' && 'data' in json && 'success' in json) {
    const apiRes = json as ApiResponse<T>;
    if (!apiRes.success && apiRes.error) {
      throw new Error(apiRes.error.message || 'API request reported failure');
    }
    return apiRes.data;
  }
  return json as T;
}
