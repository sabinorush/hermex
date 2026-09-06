import { Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service.js';
import { Category } from './category.model.js';

@Resolver()
export class CategoriesResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query(() => [Category])
  categories(): Promise<Category[]> {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }
}
