import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  API_URL,
  fetchGraphQL,
  getHomeData,
  getVehicles,
  HOME_QUERY,
  SEARCH_VEHICLES_QUERY,
  searchVehicles,
  VEHICLES_QUERY,
} from './api';

describe('api helper', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('fetchGraphQL performs POST request with JSON body and next revalidate', async () => {
    const mockData = { test: 123 };
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockData }),
    } as Response);

    const result = await fetchGraphQL<typeof mockData>('query { test }', { var1: 'val1' });

    expect(result).toEqual(mockData);
    expect(globalThis.fetch).toHaveBeenCalledWith(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: 'query { test }',
        variables: { var1: 'val1' },
      }),
      next: { revalidate: 60 },
    });
  });

  it('throws error when response is not ok', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    await expect(fetchGraphQL('query { test }')).rejects.toThrow(
      'GraphQL request failed with status 500',
    );
  });

  it('throws error when response contains GraphQL errors', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        errors: [{ message: 'Cannot query field unknown on type Query' }],
      }),
    } as Response);

    await expect(fetchGraphQL('query { test }')).rejects.toThrow(
      'Cannot query field unknown on type Query',
    );
  });

  it('getVehicles requests vehicles with default take: 9', async () => {
    const mockVehicles = {
      items: [
        {
          id: 'v-1',
          brand: 'Fiat',
          model: 'Argo',
          imageUrl: null,
          dailyRate: 150,
          transmission: 'MANUAL',
          category: { id: 'c-1', name: 'Hatch' },
        },
      ],
      totalCount: 1,
    };

    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: { vehicles: mockVehicles },
      }),
    } as Response);

    const result = await getVehicles();

    expect(result).toEqual(mockVehicles);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      API_URL,
      expect.objectContaining({
        body: JSON.stringify({
          query: VEHICLES_QUERY,
          variables: { take: 9, categoryId: undefined },
        }),
      }),
    );
  });

  it('getVehicles sends the selected category to GraphQL', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { vehicles: { items: [], totalCount: 0 } } }),
    } as Response);

    await getVehicles(9, 'cat-1');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      API_URL,
      expect.objectContaining({
        body: JSON.stringify({
          query: VEHICLES_QUERY,
          variables: { take: 9, categoryId: 'cat-1' },
        }),
      }),
    );
  });

  it('getHomeData loads categories and vehicles in one request', async () => {
    const homeData = {
      categories: [{ id: 'cat-1', name: 'Hatch' }],
      vehicles: { items: [], totalCount: 0 },
    };
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: homeData }),
    } as Response);

    await expect(getHomeData()).resolves.toEqual(homeData);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      API_URL,
      expect.objectContaining({
        body: JSON.stringify({ query: HOME_QUERY, variables: { take: 9 } }),
      }),
    );
  });

  it('searchVehicles sends dates, locations and category to GraphQL', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { searchVehicles: { items: [], totalCount: 0 } } }),
    } as Response);
    const input = {
      pickupLocationId: 'São Paulo',
      returnLocationId: 'Rio de Janeiro',
      pickupDate: '2026-10-10T12:30:00.000Z',
      returnDate: '2026-10-12T21:00:00.000Z',
      categoryId: 'cat-1',
      take: 9,
    };

    await expect(searchVehicles(input)).resolves.toEqual({ items: [], totalCount: 0 });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      API_URL,
      expect.objectContaining({
        body: JSON.stringify({ query: SEARCH_VEHICLES_QUERY, variables: { input } }),
      }),
    );
  });
});
