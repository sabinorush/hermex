import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent } from 'storybook/test';

import { VehicleCard } from './VehicleCard';

const meta = {
  component: VehicleCard,
  tags: ['ai-generated'],
  args: {
    imageSrc: '/hero/hero-woman.png',
    name: 'Chevrolet Onix',
    category: 'Hatch',
    pricePerDay: 150,
    onDetailsClick: fn(),
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VehicleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OpensDetails: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /ver detalhes de chevrolet onix/i }));
    await expect(args.onDetailsClick).toHaveBeenCalledTimes(1);
  },
};
