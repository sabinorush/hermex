import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';

import { Header } from './Header';

const meta = {
  component: Header,
  tags: ['ai-generated'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByPlaceholderText('O que você procura?')).toBeVisible();
    await expect(canvas.getByRole('link', { name: /cadastro/i })).toHaveAttribute(
      'href',
      '/cadastro',
    );
    await expect(canvas.getByRole('link', { name: /login/i })).toHaveAttribute('href', '/login');
  },
};

export const Mobile: Story = {
  globals: {
    viewport: { value: 'mobile1', isRotated: false },
  },
};

// Header uses bg-brand-secondary-pure (#1D2F40) — fails if Tailwind / global CSS did not load.
export const CssCheck: Story = {
  play: async ({ canvasElement }) => {
    const header = canvasElement.querySelector('header');
    await expect(header).not.toBeNull();
    await expect(getComputedStyle(header as HTMLElement).backgroundColor).toBe(
      'rgb(29, 47, 64)',
    );
  },
};
