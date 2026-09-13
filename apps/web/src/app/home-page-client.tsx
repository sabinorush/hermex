'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import type {
  SearchBarData,
  VehicleGridCategory,
  VehicleGridVehicle,
} from '@/components/organisms';
import { HomeTemplate } from '@/components/templates';
import { getVehicles, searchVehicles } from '@/lib/api';
import { buildCategoryHref, CATEGORY_QUERY_PARAM } from '@/lib/category-filter';
import { mapGraphQLVehicleToCard } from '@/lib/vehicle-mapper';
import type { SearchVehiclesInput } from '@/types';

type HomePageClientProps = {
  initialVehicles: VehicleGridVehicle[];
  categories: VehicleGridCategory[];
  initialErrorMessage?: string | null;
};

type RequestResult = {
  key: string;
  vehicles: VehicleGridVehicle[];
  errorMessage: string | null;
};

function toDateTime(date: string, time: string, fallbackTime: string) {
  return new Date(`${date}T${time || fallbackTime}`).toISOString();
}

function buildSearchVehiclesInput(
  data: SearchBarData,
  categoryId: string | null,
): SearchVehiclesInput {
  return {
    pickupLocationId: data.pickupLocation,
    returnLocationId: data.returnLocation,
    pickupDate: toDateTime(data.pickupDate, data.pickupTime, '00:00'),
    returnDate: toDateTime(data.returnDate, data.returnTime, '23:59'),
    categoryId: categoryId || undefined,
    take: 9,
  };
}

export function HomePageClient({
  initialVehicles,
  categories,
  initialErrorMessage = null,
}: HomePageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedCategoryId = searchParams.get(CATEGORY_QUERY_PARAM) || null;
  const [activeSearch, setActiveSearch] = useState<SearchBarData | null>(null);
  const [requestResult, setRequestResult] = useState<RequestResult | null>(null);
  const requestKey = JSON.stringify({ activeSearch, selectedCategoryId });
  const shouldFetch = Boolean(activeSearch || selectedCategoryId);
  const currentResult = requestResult?.key === requestKey ? requestResult : null;
  const vehicles = shouldFetch ? (currentResult?.vehicles ?? initialVehicles) : initialVehicles;
  const errorMessage = shouldFetch ? (currentResult?.errorMessage ?? null) : initialErrorMessage;
  const isLoading = shouldFetch && !currentResult;

  useEffect(() => {
    if (!activeSearch && !selectedCategoryId) return;

    let ignoreResult = false;
    const request = activeSearch
      ? searchVehicles(buildSearchVehiclesInput(activeSearch, selectedCategoryId))
      : getVehicles(9, selectedCategoryId || undefined);

    request
      .then((data) => {
        if (!ignoreResult) {
          setRequestResult({
            key: requestKey,
            vehicles: data.items.map(mapGraphQLVehicleToCard),
            errorMessage: null,
          });
        }
      })
      .catch(() => {
        if (!ignoreResult) {
          setRequestResult({
            key: requestKey,
            vehicles: [],
            errorMessage: activeSearch
              ? 'Não foi possível buscar os veículos no momento.'
              : 'Não foi possível filtrar os veículos no momento.',
          });
        }
      });

    return () => {
      ignoreResult = true;
    };
  }, [activeSearch, requestKey, selectedCategoryId]);

  function handleCategoryChange(categoryId: string | null) {
    router.replace(buildCategoryHref(pathname, searchParams, categoryId), { scroll: false });
  }

  function handleSearch(data: SearchBarData) {
    setActiveSearch(data);
  }

  function handleClearSearch() {
    setActiveSearch(null);
  }

  return (
    <HomeTemplate
      vehicles={vehicles}
      categories={categories}
      selectedCategoryId={selectedCategoryId}
      errorMessage={errorMessage}
      isLoading={isLoading}
      onCategoryChange={handleCategoryChange}
      onSearch={handleSearch}
      onClearSearch={handleClearSearch}
      isSearchActive={Boolean(activeSearch)}
      whatsappHref="https://www.whatsapp.com/"
      instagramHref="https://www.instagram.com/"
      tiktokHref="https://www.tiktok.com/"
    />
  );
}

export { buildSearchVehiclesInput };
export type { HomePageClientProps };
