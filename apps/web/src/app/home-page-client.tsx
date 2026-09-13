'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import type { VehicleGridCategory, VehicleGridVehicle } from '@/components/organisms';
import { HomeTemplate } from '@/components/templates';
import { getVehicles } from '@/lib/api';
import { buildCategoryHref, CATEGORY_QUERY_PARAM } from '@/lib/category-filter';
import { mapGraphQLVehicleToCard } from '@/lib/vehicle-mapper';

type HomePageClientProps = {
  initialVehicles: VehicleGridVehicle[];
  categories: VehicleGridCategory[];
  initialErrorMessage?: string | null;
};

type FilterResult = {
  categoryId: string;
  vehicles: VehicleGridVehicle[];
  errorMessage: string | null;
};

export function HomePageClient({
  initialVehicles,
  categories,
  initialErrorMessage = null,
}: HomePageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedCategoryId = searchParams.get(CATEGORY_QUERY_PARAM) || null;
  const [filterResult, setFilterResult] = useState<FilterResult | null>(null);
  const currentFilterResult = filterResult?.categoryId === selectedCategoryId ? filterResult : null;
  const vehicles = selectedCategoryId
    ? currentFilterResult
      ? currentFilterResult.vehicles
      : initialVehicles
    : initialVehicles;
  const errorMessage = selectedCategoryId
    ? currentFilterResult
      ? currentFilterResult.errorMessage
      : null
    : initialErrorMessage;
  const isLoading = Boolean(selectedCategoryId && !currentFilterResult);

  useEffect(() => {
    if (!selectedCategoryId) return;

    let ignoreResult = false;

    getVehicles(9, selectedCategoryId)
      .then((data) => {
        if (!ignoreResult) {
          setFilterResult({
            categoryId: selectedCategoryId,
            vehicles: data.items.map(mapGraphQLVehicleToCard),
            errorMessage: null,
          });
        }
      })
      .catch(() => {
        if (!ignoreResult) {
          setFilterResult({
            categoryId: selectedCategoryId,
            vehicles: [],
            errorMessage: 'Não foi possível filtrar os veículos no momento.',
          });
        }
      });

    return () => {
      ignoreResult = true;
    };
  }, [selectedCategoryId]);

  function handleCategoryChange(categoryId: string | null) {
    router.replace(buildCategoryHref(pathname, searchParams, categoryId), { scroll: false });
  }

  return (
    <HomeTemplate
      vehicles={vehicles}
      categories={categories}
      selectedCategoryId={selectedCategoryId}
      errorMessage={errorMessage}
      isLoading={isLoading}
      onCategoryChange={handleCategoryChange}
      whatsappHref="https://www.whatsapp.com/"
      instagramHref="https://www.instagram.com/"
      tiktokHref="https://www.tiktok.com/"
    />
  );
}

export type { HomePageClientProps };
