import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent } from 'storybook/test';

import { VehicleGrid } from './VehicleGrid';

const vehicles = [
  {
    id: 'vehicle-1',
    imageSrc: '/hero/hero-woman.png',
    name: 'Chevrolet Onix',
    category: 'Hatch',
    pricePerDay: 150,
  },
  {
    id: 'vehicle-2',
    imageSrc: '/hero/hero-woman.png',
    name: 'Hyundai HB20',
    category: 'Hatch',
    pricePerDay: 160,
  },
  {
    id: 'vehicle-3',
    imageSrc: '/hero/hero-woman.png',
    name: 'Jeep Compass',
    category: 'SUV',
    pricePerDay: 320,
  },
];

const meta = {
  component: VehicleGrid,
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
  },
} satisfies Meta<typeof VehicleGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('combobox', { name: /categoria de veículo/i })).toBeVisible();
    await expect(canvas.getAllByRole('article')).toHaveLength(3);
  },
};

export const Interactions: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.selectOptions(
      canvas.getByRole('combobox', { name: /categoria de veículo/i }),
      'suv',
    );
    await userEvent.click(canvas.getByRole('button', { name: /ver detalhes de jeep compass/i }));

    await expect(args.onCategoryChange).toHaveBeenCalledWith('suv');
    await expect(args.onDetailsClick).toHaveBeenCalledWith('vehicle-3');
  },
};

export const Empty: Story = {
  args: {
    vehicles: [],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Nenhum veículo encontrado')).toBeVisible();
  },
};

export const ErrorState: Story = {
  args: {
    vehicles: [],
    errorMessage: 'Não foi possível carregar os veículos no momento.',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('vehicle-grid-error')).toBeVisible();
    await expect(
      canvas.getByText('Não foi possível carregar os veículos no momento.'),
    ).toBeVisible();
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
