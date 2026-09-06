import { Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service.js';
import { Transmission, Vehicle } from './vehicle.model.js';

@Resolver(() => Vehicle)
export class VehiclesResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query(() => [Vehicle])
  async vehicles(): Promise<Vehicle[]> {
    const vehicles = await this.prisma.vehicle.findMany({
      include: { category: true },
      orderBy: { createdAt: 'asc' },
    });

    return vehicles.map((vehicle) => ({
      ...vehicle,
      transmission: vehicle.transmission as Transmission,
    }));
  }
}
