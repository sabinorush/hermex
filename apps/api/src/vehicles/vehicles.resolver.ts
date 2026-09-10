import { BadRequestException } from '@nestjs/common';
import { Args, ID, Int, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service.js';
import { SearchVehiclesInput } from './search-vehicles.input.js';
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
    return this.findAvailableVehicles({ categoryId, skip, take });
  }

  @Query(() => VehiclePage)
  async searchVehicles(@Args('input') input: SearchVehiclesInput): Promise<VehiclePage> {
    if (input.returnDate <= input.pickupDate) {
      throw new BadRequestException('returnDate deve ser posterior a pickupDate');
    }

    // pickupLocationId/returnLocationId são aceitos mas ainda não filtram: a
    // disponibilidade real por local e período só existirá quando o modelo
    // Reservation for implementado.
    return this.findAvailableVehicles({
      categoryId: input.categoryId,
      skip: input.skip ?? DEFAULT_SKIP,
      take: input.take ?? DEFAULT_TAKE,
    });
  }

  private async findAvailableVehicles({
    categoryId,
    skip,
    take,
  }: {
    categoryId?: string;
    skip: number;
    take: number;
  }): Promise<VehiclePage> {
    const where: { available: boolean; categoryId?: string } = {
      available: true,
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const clampedSkip = Math.max(skip, 0);
    const clampedTake = Math.min(Math.max(take, 0), MAX_TAKE);

    const [vehicles, totalCount] = await Promise.all([
      this.prisma.vehicle.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'asc' },
        skip: clampedSkip,
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
