import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service.js';
import { LocationsResolver } from './locations.resolver.js';

describe('LocationsResolver', () => {
  let resolver: LocationsResolver;
  const findMany = vi.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsResolver,
        {
          provide: PrismaService,
          useValue: {
            location: { findMany },
          },
        },
      ],
    }).compile();

    resolver = module.get<LocationsResolver>(LocationsResolver);
    findMany.mockReset();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('returns locations ordered by name', async () => {
    const locations = [
      {
        id: 'location-1',
        name: 'Aeroporto de Congonhas',
        address: 'Avenida Washington Luís, s/n',
        city: 'São Paulo',
        state: 'SP',
        createdAt: new Date('2026-09-01T00:00:00.000Z'),
        updatedAt: new Date('2026-09-01T00:00:00.000Z'),
      },
    ];
    findMany.mockResolvedValue(locations);

    await expect(resolver.locations()).resolves.toEqual(locations);
    expect(findMany).toHaveBeenCalledWith({
      orderBy: { name: 'asc' },
    });
  });
});
