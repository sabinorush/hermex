'use client';

import {
  Footer,
  Header,
  HeroBanner,
  SearchBar,
  VehicleGrid,
  type FooterProps,
  type SearchBarProps,
  type VehicleGridProps,
} from '@/components/organisms';

type HomeTemplateProps = FooterProps & SearchBarProps & VehicleGridProps;

export function HomeTemplate({
  vehicles,
  categories,
  selectedCategoryId,
  errorMessage,
  isLoading,
  onCategoryChange,
  onDetailsClick,
  onSearch,
  onClearSearch,
  isSearchActive,
  whatsappHref,
  instagramHref,
  tiktokHref,
}: HomeTemplateProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      <Header />
      <main className="flex-1">
        <HeroBanner />
        <div data-testid="search-overlap" className="relative z-10 -mt-24 sm:-mt-28 lg:-mt-32">
          <SearchBar
            onSearch={onSearch}
            onClearSearch={onClearSearch}
            isSearchActive={isSearchActive}
          />
        </div>
        <VehicleGrid
          vehicles={vehicles}
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          errorMessage={errorMessage}
          isLoading={isLoading}
          onCategoryChange={onCategoryChange}
          onDetailsClick={onDetailsClick}
        />
      </main>
      <Footer whatsappHref={whatsappHref} instagramHref={instagramHref} tiktokHref={tiktokHref} />
    </div>
  );
}

export type { HomeTemplateProps };
