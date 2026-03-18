import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, apiRequest } from '../services/apiClient';

describe('apiRequest', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('throws ApiError for non-2xx responses', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: async () => ({ message: 'backend failed' }),
    });

    vi.stubGlobal('fetch', fetchMock);

    await expect(apiRequest('/bookmarks')).rejects.toEqual(
      expect.objectContaining<ApiError>({
        name: 'ApiError',
        message: 'backend failed',
        status: 500,
      }),
    );
  });

  it('throws ApiError for network failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(apiRequest('/bookmarks')).rejects.toEqual(
      expect.objectContaining<ApiError>({
        name: 'ApiError',
        message: 'Network request failed. Please try again.',
        status: 0,
      }),
    );
  });
});
