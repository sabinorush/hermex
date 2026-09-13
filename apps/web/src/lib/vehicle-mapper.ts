import type { VehicleGridVehicle } from '@/components/organisms';
import type { GraphQLVehicle, Transmission } from '@/types';

function formatTransmission(transmission: Transmission | string): string {
  switch (transmission) {
    case 'AUTOMATIC':
      return 'Automático';
    case 'MANUAL':
      return 'Manual';
    default:
      return transmission;
  }
}

export function mapGraphQLVehicleToCard(vehicle: GraphQLVehicle): VehicleGridVehicle {
  return {
    id: vehicle.id,
    imageSrc: vehicle.imageUrl || '/hero/hero-woman.png',
    name: `${vehicle.brand} ${vehicle.model}`,
    category: `${vehicle.category.name} ${formatTransmission(vehicle.transmission)}`,
    pricePerDay: vehicle.dailyRate,
  };
}
