import { Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service.js';
import { Health } from './health.model.js';

@Resolver()
export class HealthResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query(() => Health)
  async health(): Promise<Health> {
    await this.prisma.$queryRaw`SELECT 1`;
    return { status: 'ok', database: 'connected' };
  }
}
