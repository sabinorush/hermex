import { PrismaService } from '../prisma/prisma.service.js';
import { CategoriesResolver } from './categories.resolver.js';

describe('CategoriesResolver', () => {
  it('returns categories ordered by name', async () => {
    const categories = [
      { id: '1', name: 'Hatch' },
      { id: '2', name: 'Sedan' },
    ];
    const prisma = {
      category: {
        findMany: vi.fn().mockResolvedValue(categories),
      },
    } as unknown as PrismaService;
    const resolver = new CategoriesResolver(prisma);

    await expect(resolver.categories()).resolves.toEqual(categories);
    expect(prisma.category.findMany).toHaveBeenCalledWith({
      orderBy: { name: 'asc' },
    });
  });
});
