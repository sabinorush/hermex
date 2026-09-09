import { Args, ID, Int, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service.js';
import { Transmission, Vehicle } from './vehicle.model.js';
import { VehiclePage } from './vehicle-page.model.js';

const DEFAULT_SKIP = 0;
const DEFAULT_TAKE = 9;
const MAX_TAKE = 27;

@Resolver(() => Vehicle)
export class VehiclesResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query(() => VehiclePage)
  async vehicles(
    @Args('categoryId', { type: () => ID, nullable: true })
    categoryId?: string,
    @Args('skip', { type: () => Int, nullable: true, defaultValue: DEFAULT_SKIP })
    skip: number = DEFAULT_SKIP,
    @Args('take', { type: () => Int, nullable: true, defaultValue: DEFAULT_TAKE })
    take: number = DEFAULT_TAKE,
  ): Promise<VehiclePage> {
    const where: { available: boolean; categoryId?: string } = {
      available: true,
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const clampedTake = Math.min(take, MAX_TAKE);

    const [vehicles, totalCount] = await Promise.all([
      this.prisma.vehicle.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'asc' },
        skip,
        take: clampedTake,
      }),
      this.prisma.vehicle.count({ where }),
    ]);

    return {
      items: vehicles.map((vehicle) => ({
        ...vehicle,
        transmission: vehicle.transmission as Transmission,
      })),
      totalCount,
    };
  }
}
