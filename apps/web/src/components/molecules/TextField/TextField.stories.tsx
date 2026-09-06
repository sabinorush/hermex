import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';

import { TextField } from './TextField';

const meta = {
  component: TextField,
  tags: ['ai-generated'],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Outlined: Story = {
  args: { variant: 'outlined', icon: 'search', placeholder: 'O que você procura?' },
  play: async ({ canvas }) => {
    await expect(canvas.getByPlaceholderText('O que você procura?')).toBeVisible();
  },
};

export const WithoutIcon: Story = { args: { placeholder: 'Digite aqui' } };
