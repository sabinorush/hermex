import { HomeTemplate } from '@/components/templates';
import type { VehicleGridCategory, VehicleGridVehicle } from '@/components/organisms';
import { getVehicles } from '@/lib/api';
import type { GraphQLVehicle, Transmission } from '@/types';

export const revalidate = 60;

const defaultCategories: VehicleGridCategory[] = [
  { id: 'hatch', name: 'Hatch' },
  { id: 'sedan', name: 'Sedan' },
  { id: 'suv', name: 'SUV' },
  { id: 'minivan', name: 'Minivan' },
  { id: 'picape', name: 'Picape' },
];

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

export default async function Home() {
  let vehicles: VehicleGridVehicle[] = [];
  let errorMessage: string | null = null;

  try {
    const data = await getVehicles(9);
    vehicles = data.items.map(mapGraphQLVehicleToCard);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Falha ao carregar veículos via GraphQL:', error);
    errorMessage = 'Não foi possível carregar os veículos no momento.';
  }

  return (
    <HomeTemplate
      vehicles={vehicles}
      categories={defaultCategories}
      errorMessage={errorMessage}
      whatsappHref="https://www.whatsapp.com/"
      instagramHref="https://www.instagram.com/"
      tiktokHref="https://www.tiktok.com/"
    />
  );
}
