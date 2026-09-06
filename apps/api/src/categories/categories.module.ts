import { Module } from '@nestjs/common';
import { CategoriesResolver } from './categories.resolver.js';

@Module({
  providers: [CategoriesResolver],
})
export class CategoriesModule {}
