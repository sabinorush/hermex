import { describe, expect, it, vi } from 'vitest';

import Home, { mapGraphQLVehicleToCard } from './page';
import * as api from '@/lib/api';
import type { GraphQLVehicle } from '@/types';

describe('Home page', () => {
  it('maps GraphQL vehicle with manual transmission and null imageUrl correctly', () => {
    const vehicle: GraphQLVehicle = {
      id: 'v-1',
      brand: 'Fiat',
      model: 'Argo 1.0',
      imageUrl: null,
      dailyRate: 150,
      transmission: 'MANUAL',
      category: {
        id: 'cat-1',
        name: 'Hatch',
      },
    };

    const card = mapGraphQLVehicleToCard(vehicle);

    expect(card).toEqual({
      id: 'v-1',
      imageSrc: '/hero/hero-woman.png',
      name: 'Fiat Argo 1.0',
      category: 'Hatch Manual',
      pricePerDay: 150,
    });
  });

  it('maps GraphQL vehicle with automatic transmission and custom imageUrl correctly', () => {
    const vehicle: GraphQLVehicle = {
      id: 'v-2',
      brand: 'Jeep',
      model: 'Compass',
      imageUrl: 'https://example.com/compass.jpg',
      dailyRate: 320,
      transmission: 'AUTOMATIC',
      category: {
        id: 'cat-2',
        name: 'SUV',
      },
    };

    const card = mapGraphQLVehicleToCard(vehicle);

    expect(card).toEqual({
      id: 'v-2',
      imageSrc: 'https://example.com/compass.jpg',
      name: 'Jeep Compass',
      category: 'SUV Automático',
      pricePerDay: 320,
    });
  });

  it('renders vehicles successfully when getVehicles succeeds', async () => {
    const mockVehicles = {
      items: [
        {
          id: 'v-1',
          brand: 'Fiat',
          model: 'Argo',
          imageUrl: null,
          dailyRate: 150,
          transmission: 'MANUAL' as const,
          category: { id: 'c-1', name: 'Hatch' },
        },
      ],
      totalCount: 1,
    };

    vi.spyOn(api, 'getHomeData').mockResolvedValueOnce({
      categories: [{ id: 'c-1', name: 'Hatch' }],
      vehicles: mockVehicles,
    });

    const jsx = await Home();

    const homePageClient = jsx.props.children;
    expect(homePageClient.props.initialVehicles).toHaveLength(1);
    expect(homePageClient.props.initialVehicles[0].name).toBe('Fiat Argo');
    expect(homePageClient.props.initialVehicles[0].category).toBe('Hatch Manual');
    expect(homePageClient.props.categories).toEqual([{ id: 'c-1', name: 'Hatch' }]);
    expect(homePageClient.props.initialErrorMessage).toBeNull();
  });

  it('handles API failure gracefully without throwing and provides friendly error message', async () => {
    vi.spyOn(api, 'getHomeData').mockRejectedValueOnce(new Error('Connection refused'));
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const jsx = await Home();

    const homePageClient = jsx.props.children;
    expect(homePageClient.props.initialVehicles).toEqual([]);
    expect(homePageClient.props.categories).toEqual([]);
    expect(homePageClient.props.initialErrorMessage).toBe(
      'Não foi possível carregar os veículos no momento.',
    );
  });
});
