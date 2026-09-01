import { Module } from '@nestjs/common';
import { LocationsResolver } from './locations.resolver.js';

@Module({
  providers: [LocationsResolver],
})
export class LocationsModule {}
