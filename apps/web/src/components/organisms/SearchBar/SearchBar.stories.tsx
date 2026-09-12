import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fireEvent, fn, userEvent, within } from 'storybook/test';

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
    await fireEvent.change(canvas.getByLabelText('Data de retirada'), {
      target: { value: '2026-10-10' },
    });
    await fireEvent.change(canvas.getByLabelText('Hora de retirada'), {
      target: { value: '09:30' },
    });
    // Date ordering is intentionally left to the caller, per MEX-9.
    await fireEvent.change(canvas.getByLabelText('Data de devolução'), {
      target: { value: '2026-10-09' },
    });
    await fireEvent.change(canvas.getByLabelText('Hora de devolução'), {
      target: { value: '18:45' },
    });
    await user.click(canvas.getByRole('button', { name: /buscar/i }));

    await expect(args.onSearch).toHaveBeenCalledTimes(1);
    await expect(args.onSearch).toHaveBeenCalledWith({
      pickupLocation: 'São Paulo',
      returnLocation: 'Rio de Janeiro',
      pickupDate: '2026-10-10',
      pickupTime: '09:30',
      returnDate: '2026-10-09',
      returnTime: '18:45',
    });
  },
};

export const SubmitsEmptyData: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /buscar/i }));

    await expect(args.onSearch).toHaveBeenCalledTimes(1);
    await expect(args.onSearch).toHaveBeenCalledWith({
      pickupLocation: '',
      returnLocation: '',
      pickupDate: '',
      pickupTime: '',
      returnDate: '',
      returnTime: '',
    });
  },
};

// SearchBar uses bg-brand-secondary-pure (#1D2F40) — fails if Tailwind / global CSS did not load.
export const CssCheck: Story = {
  play: async ({ canvasElement }) => {
    const form = within(canvasElement)
      .getByRole('button', { name: /buscar/i })
      .closest('form');
    await expect(form).not.toBeNull();
    await expect(getComputedStyle(form as HTMLElement).backgroundColor).toBe('rgb(29, 47, 64)');
  },
};
