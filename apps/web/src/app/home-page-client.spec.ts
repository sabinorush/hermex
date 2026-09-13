import { describe, expect, it } from 'vitest';

import { buildSearchVehiclesInput } from './home-page-client';

describe('buildSearchVehiclesInput', () => {
  const searchData = {
    pickupLocation: 'São Paulo',
    returnLocation: 'Rio de Janeiro',
    pickupDate: '2026-10-10',
    pickupTime: '09:30',
    returnDate: '2026-10-12',
    returnTime: '18:45',
  };

  it('maps the six search fields and selected category to the GraphQL input', () => {
    expect(buildSearchVehiclesInput(searchData, 'cat-1')).toEqual({
      pickupLocationId: 'São Paulo',
      returnLocationId: 'Rio de Janeiro',
      pickupDate: new Date('2026-10-10T09:30').toISOString(),
      returnDate: new Date('2026-10-12T18:45').toISOString(),
      categoryId: 'cat-1',
      take: 9,
    });
  });

  it('uses full-day times and omits category when optional fields are empty', () => {
    expect(
      buildSearchVehiclesInput({ ...searchData, pickupTime: '', returnTime: '' }, null),
    ).toEqual({
      pickupLocationId: 'São Paulo',
      returnLocationId: 'Rio de Janeiro',
      pickupDate: new Date('2026-10-10T00:00').toISOString(),
      returnDate: new Date('2026-10-12T23:59').toISOString(),
      categoryId: undefined,
      take: 9,
    });
  });
});
