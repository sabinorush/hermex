import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent } from 'storybook/test';

import { Dropdown } from './Dropdown';

const meta = {
  component: Dropdown,
  tags: ['ai-generated'],
  args: {
    options: [
      { value: 'hatch', label: 'Hatch' },
      { value: 'suv', label: 'SUV' },
    ],
    value: null,
    onChange: fn(),
    placeholder: 'Selecione a categoria',
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SelectsAnOption: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.selectOptions(canvas.getByRole('combobox'), 'suv');
    await expect(args.onChange).toHaveBeenCalledWith('suv');
  },
};
