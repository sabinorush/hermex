import { Suspense } from 'react';

import { HomePageClient } from './home-page-client';
import { HomeTemplate } from '@/components/templates';
import type { VehicleGridCategory, VehicleGridVehicle } from '@/components/organisms';
import { getHomeData } from '@/lib/api';
import { mapGraphQLVehicleToCard } from '@/lib/vehicle-mapper';

export const revalidate = 60;

export { mapGraphQLVehicleToCard } from '@/lib/vehicle-mapper';

export default async function Home() {
  let vehicles: VehicleGridVehicle[] = [];
  let categories: VehicleGridCategory[] = [];
  let errorMessage: string | null = null;

  try {
    const data = await getHomeData(9);
    vehicles = data.vehicles.items.map(mapGraphQLVehicleToCard);
    categories = data.categories;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Falha ao carregar veículos via GraphQL:', error);
    errorMessage = 'Não foi possível carregar os veículos no momento.';
  }

  const sharedProps = {
    vehicles,
    categories,
    errorMessage,
    whatsappHref: 'https://www.whatsapp.com/',
    instagramHref: 'https://www.instagram.com/',
    tiktokHref: 'https://www.tiktok.com/',
  };

  return (
    <Suspense fallback={<HomeTemplate {...sharedProps} isLoading />}>
      <HomePageClient
        initialVehicles={vehicles}
        categories={categories}
        initialErrorMessage={errorMessage}
      />
    </Suspense>
  );
}
