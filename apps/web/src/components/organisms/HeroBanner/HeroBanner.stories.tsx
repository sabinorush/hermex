import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';

import { HeroBanner } from './HeroBanner';

const meta = {
  component: HeroBanner,
  tags: ['ai-generated'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof HeroBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('heading', { name: /encontre o carro ideal para todas as ocasiões/i }),
    ).toBeVisible();
    await expect(canvas.getByAltText('Mulher sorrindo dirigindo um carro')).toBeVisible();
  },
};

export const Mobile: Story = {
  globals: {
    viewport: { value: 'mobile1', isRotated: false },
  },
};

// HeroBanner uses bg-brand-secondary-dark (#23384D) — fails if Tailwind / global CSS did not load.
export const CssCheck: Story = {
  play: async ({ canvasElement }) => {
    const section = canvasElement.querySelector('section');
    await expect(section).not.toBeNull();
    await expect(getComputedStyle(section as HTMLElement).backgroundColor).toBe(
      'rgb(35, 56, 77)',
    );
  },
};
