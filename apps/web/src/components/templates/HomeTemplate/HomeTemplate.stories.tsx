import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';

import { HomeTemplate } from './HomeTemplate';

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

const meta = {
  component: HomeTemplate,
  tags: ['ai-generated'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    vehicles,
    categories: [
      { id: 'hatch', name: 'Hatch' },
      { id: 'suv', name: 'SUV' },
    ],
    selectedCategoryId: null,
    onCategoryChange: fn(),
    onDetailsClick: fn(),
    onSearch: fn(),
    whatsappHref: 'https://www.whatsapp.com/',
    instagramHref: 'https://www.instagram.com/',
    tiktokHref: 'https://www.tiktok.com/',
  },
} satisfies Meta<typeof HomeTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const header = canvas.getByRole('banner');
    const heroTitle = canvas.getByRole('heading', {
      level: 1,
      name: /encontre o carro ideal para todas as ocasiões/i,
    });
    const search = canvas.getByRole('button', { name: /buscar/i }).closest('form');
    const vehicleGrid = canvas.getByTestId('vehicle-grid');
    const footer = canvas.getByRole('contentinfo');
    const overlap = canvas.getByTestId('search-overlap');

    await expect(header).toBeVisible();
    await expect(heroTitle).toBeVisible();
    await expect(search).not.toBeNull();
    await expect(vehicleGrid).toBeVisible();
    await expect(footer).toBeVisible();
    await expect(parseFloat(getComputedStyle(overlap).marginTop)).toBeLessThan(0);

    const orderedElements = [header, heroTitle, search as HTMLFormElement, vehicleGrid, footer];
    for (const [index, element] of orderedElements.entries()) {
      if (index === 0) continue;
      await expect(
        orderedElements[index - 1].compareDocumentPosition(element) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    }

    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

export const Empty: Story = {
  args: {
    vehicles: [],
  },
};

export const Tablet: Story = {
  globals: {
    viewport: { value: 'tablet', isRotated: false },
  },
};

export const Mobile: Story = {
  globals: {
    viewport: { value: 'mobile1', isRotated: false },
  },
};
