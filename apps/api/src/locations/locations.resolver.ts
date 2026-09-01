import { Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service.js';
import { Location } from './location.model.js';

@Resolver(() => Location)
export class LocationsResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query(() => [Location])
  locations(): Promise<Location[]> {
    return this.prisma.location.findMany({
      orderBy: { name: 'asc' },
    });
  }
}
