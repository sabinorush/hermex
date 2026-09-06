import { Module } from '@nestjs/common';
import { VehiclesResolver } from './vehicles.resolver.js';

@Module({
  providers: [VehiclesResolver],
})
export class VehiclesModule {}
