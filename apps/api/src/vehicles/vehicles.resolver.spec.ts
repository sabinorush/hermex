import { PrismaService } from '../prisma/prisma.service.js';
import { VehiclesResolver } from './vehicles.resolver.js';

describe('VehiclesResolver', () => {
  it('returns vehicles ordered by createdAt with category and typed transmission', async () => {
    const vehicles = [
      {
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
      },
    ];
    const prisma = {
      vehicle: {
        findMany: vi.fn().mockResolvedValue(vehicles),
      },
    } as unknown as PrismaService;
    const resolver = new VehiclesResolver(prisma);

    await expect(resolver.vehicles()).resolves.toEqual(vehicles);
    expect(prisma.vehicle.findMany).toHaveBeenCalledWith({
      include: { category: true },
      orderBy: { createdAt: 'asc' },
    });
  });
});
