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

  function createResolver(vehicles: unknown[]) {
    const prisma = {
      vehicle: {
        findMany: vi.fn().mockResolvedValue(vehicles),
      },
    } as unknown as PrismaService;
    return { resolver: new VehiclesResolver(prisma), prisma };
  }

  it('returns available vehicles with category and typed transmission when no categoryId is given', async () => {
    const { resolver, prisma } = createResolver([vehicle]);

    await expect(resolver.vehicles()).resolves.toEqual([vehicle]);
    expect(prisma.vehicle.findMany).toHaveBeenCalledWith({
      where: { available: true },
      include: { category: true },
      orderBy: { createdAt: 'asc' },
    });
  });

  it('filters by categoryId when provided, keeping the available:true filter', async () => {
    const { resolver, prisma } = createResolver([vehicle]);

    await expect(resolver.vehicles('cat-1')).resolves.toEqual([vehicle]);
    expect(prisma.vehicle.findMany).toHaveBeenCalledWith({
      where: { available: true, categoryId: 'cat-1' },
      include: { category: true },
      orderBy: { createdAt: 'asc' },
    });
  });

  it('returns an empty list when categoryId matches no vehicles', async () => {
    const { resolver } = createResolver([]);

    await expect(resolver.vehicles('categoria-inexistente')).resolves.toEqual(
      [],
    );
  });
});
