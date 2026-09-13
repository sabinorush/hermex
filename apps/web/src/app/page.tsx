'use client';

import { useState } from 'react';

import { HomeTemplate } from '@/components/templates';

const vehicles = [
  {
    id: 'vehicle-1',
    imageSrc: '/hero/hero-woman.png',
    name: 'Chevrolet Onix',
    category: 'Hatch manual',
    pricePerDay: 150,
  },
  {
    id: 'vehicle-2',
    imageSrc: '/hero/hero-woman.png',
    name: 'Hyundai HB20',
    category: 'Hatch automático',
    pricePerDay: 160,
  },
  {
    id: 'vehicle-3',
    imageSrc: '/hero/hero-woman.png',
    name: 'Jeep Compass',
    category: 'SUV automático',
    pricePerDay: 320,
  },
];

const categories = [
  { id: 'hatch', name: 'Hatch' },
  { id: 'sedan', name: 'Sedan' },
  { id: 'suv', name: 'SUV' },
  { id: 'minivan', name: 'Minivan' },
  { id: 'picape', name: 'Picape' },
];

export default function Home() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  return (
    <HomeTemplate
      vehicles={vehicles}
      categories={categories}
      selectedCategoryId={selectedCategoryId}
      onCategoryChange={setSelectedCategoryId}
      onDetailsClick={() => undefined}
      onSearch={() => undefined}
      whatsappHref="https://www.whatsapp.com/"
      instagramHref="https://www.instagram.com/"
      tiktokHref="https://www.tiktok.com/"
    />
  );
}
