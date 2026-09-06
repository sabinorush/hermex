import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service.js';
import { Transmission, Vehicle } from './vehicle.model.js';

@Resolver(() => Vehicle)
export class VehiclesResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query(() => [Vehicle])
  async vehicles(
    @Args('categoryId', { type: () => ID, nullable: true })
    categoryId?: string,
  ): Promise<Vehicle[]> {
    const where: { available: boolean; categoryId?: string } = {
      available: true,
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const vehicles = await this.prisma.vehicle.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'asc' },
    });

    return vehicles.map((vehicle) => ({
      ...vehicle,
      transmission: vehicle.transmission as Transmission,
    }));
  }
}
