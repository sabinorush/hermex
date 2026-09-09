import { PrismaService } from '../prisma/prisma.service.js';
import { VehiclesResolver } from './vehicles.resolver.js';

describe('VehiclesResolver', () => {
  const vehicle = {
    id: '1',
    brand: 'Fiat',
    model: 'Argo',
    year: 2023,
    licensePlate: 'ABC1D23',
    dailyRate: 150,
    available: true,
    imageUrl: null,
    transmission: 'MANUAL',
    categoryId: 'cat-1',
    category: { id: 'cat-1', name: 'Hatch' },
  };

  function createResolver(vehicles: unknown[], totalCount: number) {
    const prisma = {
      vehicle: {
        findMany: vi.fn().mockResolvedValue(vehicles),
        count: vi.fn().mockResolvedValue(totalCount),
      },
    } as unknown as PrismaService;
    return { resolver: new VehiclesResolver(prisma), prisma };
  }

  it('returns the first 9 vehicles and the totalCount when called with no args', async () => {
    const { resolver, prisma } = createResolver([vehicle], 1);

    await expect(resolver.vehicles()).resolves.toEqual({
      items: [vehicle],
      totalCount: 1,
    });
    expect(prisma.vehicle.findMany).toHaveBeenCalledWith({
      where: { available: true },
      include: { category: true },
      orderBy: { createdAt: 'asc' },
      skip: 0,
      take: 9,
    });
    expect(prisma.vehicle.count).toHaveBeenCalledWith({
      where: { available: true },
    });
  });

  it('returns the second page when skip and take are provided', async () => {
    const { resolver, prisma } = createResolver([vehicle], 10);

    await resolver.vehicles(undefined, 9, 9);

    expect(prisma.vehicle.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 9, take: 9 }),
    );
  });

  it('clamps take to 27 when a larger value is requested', async () => {
    const { resolver, prisma } = createResolver([], 0);

    await resolver.vehicles(undefined, 0, 100);

    expect(prisma.vehicle.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 27 }));
  });

  it('filters by categoryId, keeping available:true, and scopes totalCount to that category', async () => {
    const { resolver, prisma } = createResolver([vehicle], 1);

    await expect(resolver.vehicles('cat-1')).resolves.toEqual({
      items: [vehicle],
      totalCount: 1,
    });
    expect(prisma.vehicle.findMany).toHaveBeenCalledWith({
      where: { available: true, categoryId: 'cat-1' },
      include: { category: true },
      orderBy: { createdAt: 'asc' },
      skip: 0,
      take: 9,
    });
    expect(prisma.vehicle.count).toHaveBeenCalledWith({
      where: { available: true, categoryId: 'cat-1' },
    });
  });

  it('returns an empty page with totalCount 0 when categoryId matches no vehicles', async () => {
    const { resolver } = createResolver([], 0);

    await expect(resolver.vehicles('categoria-inexistente')).resolves.toEqual({
      items: [],
      totalCount: 0,
    });
  });
});
