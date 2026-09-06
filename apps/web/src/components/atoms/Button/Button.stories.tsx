import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';

import { Button } from './Button';

const meta = {
  component: Button,
  tags: ['ai-generated'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { children: 'Confirmar' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: /confirmar/i })).toBeVisible();
  },
};

export const Disabled: Story = { args: { children: 'Confirmar', disabled: true } };
