import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';

import { Logo } from './Logo';

const meta = {
  component: Logo,
  tags: ['ai-generated'],
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Hermex')).toBeVisible();
  },
};

export const Inverted: Story = {
  args: { variant: 'inverted' },
  decorators: [
    (Story) => (
      <div className="bg-brand-secondary-pure p-4">
        <Story />
      </div>
    ),
  ],
};
