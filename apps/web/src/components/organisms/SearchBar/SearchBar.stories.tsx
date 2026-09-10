import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { SearchBar } from './SearchBar';

const meta = {
  component: SearchBar,
  tags: ['ai-generated'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onSearch: fn(),
  },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByPlaceholderText('Local de retirada')).toBeVisible();
    await expect(canvas.getByPlaceholderText('Local de devolução')).toBeVisible();
    await expect(canvas.getByRole('button', { name: /buscar/i })).toBeVisible();
  },
};

export const Mobile: Story = {
  globals: {
    viewport: { value: 'mobile1', isRotated: false },
  },
};

export const SubmitsStructuredData: Story = {
  play: async ({ canvas, args }) => {
    const user = userEvent.setup();

    await user.type(canvas.getByLabelText('Local de retirada'), 'São Paulo');
    await user.type(canvas.getByLabelText('Local de devolução'), 'Rio de Janeiro');
    await user.click(canvas.getByRole('button', { name: /buscar/i }));

    await expect(args.onSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        pickupLocation: 'São Paulo',
        returnLocation: 'Rio de Janeiro',
      }),
    );
  },
};

// SearchBar uses bg-brand-secondary-pure (#1D2F40) — fails if Tailwind / global CSS did not load.
export const CssCheck: Story = {
  play: async ({ canvasElement }) => {
    const form = within(canvasElement).getByRole('button', { name: /buscar/i }).closest('form');
    await expect(form).not.toBeNull();
    await expect(getComputedStyle(form as HTMLElement).backgroundColor).toBe('rgb(29, 47, 64)');
  },
};
