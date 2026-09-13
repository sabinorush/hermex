'use client';

import { Dropdown, VehicleCard } from '@/components/molecules';

type VehicleGridVehicle = {
  id: string;
  imageSrc: string;
  name: string;
  category: string;
  pricePerDay: number;
};

type VehicleGridCategory = {
  id: string;
  name: string;
};

type VehicleGridProps = {
  vehicles: VehicleGridVehicle[];
  categories?: VehicleGridCategory[];
  selectedCategoryId?: string | null;
  errorMessage?: string | null;
  isLoading?: boolean;
  onCategoryChange?: (categoryId: string | null) => void;
  onDetailsClick?: (vehicleId: string) => void;
};

export function VehicleGrid({
  vehicles,
  categories = [],
  selectedCategoryId = null,
  errorMessage = null,
  isLoading = false,
  onCategoryChange = () => {},
  onDetailsClick,
}: VehicleGridProps) {
  return (
    <section className="w-full bg-slate-50 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <Dropdown
          className="mb-8 max-w-sm"
          label="Categoria de veículo"
          placeholder="Todas as categorias"
          options={categories.map((category) => ({
            value: category.id,
            label: category.name,
          }))}
          value={selectedCategoryId}
          onChange={onCategoryChange}
        />

        <div aria-busy={isLoading} className="relative">
          {isLoading ? (
            <p
              aria-live="polite"
              className="absolute -top-6 right-0 text-sm font-medium text-brand-secondary-pure"
            >
              Atualizando veículos...
            </p>
          ) : null}

          <div className={`transition-opacity duration-200 ${isLoading ? 'opacity-50' : ''}`}>
            {errorMessage ? (
              <div
                data-testid="vehicle-grid-error"
                className="rounded-xl bg-white px-6 py-12 text-center text-slate-600 shadow-sm"
              >
                <p className="font-semibold text-brand-secondary-pure">{errorMessage}</p>
                <p className="mt-1 text-sm text-slate-500">
                  Não foi possível carregar os veículos no momento. Tente novamente mais tarde.
                </p>
              </div>
            ) : vehicles.length === 0 ? (
              <p className="rounded-xl bg-white px-6 py-12 text-center text-slate-600 shadow-sm">
                Nenhum veículo encontrado
              </p>
            ) : (
              <div
                data-testid="vehicle-grid"
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {vehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    imageSrc={vehicle.imageSrc}
                    name={vehicle.name}
                    category={vehicle.category}
                    pricePerDay={vehicle.pricePerDay}
                    onDetailsClick={() => onDetailsClick?.(vehicle.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export type { VehicleGridCategory, VehicleGridProps, VehicleGridVehicle };
