import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';

import { NavLink } from './NavLink';

const meta = {
  component: NavLink,
  tags: ['ai-generated'],
  decorators: [
    (Story) => (
      <div className="bg-brand-secondary-pure p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NavLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Login: Story = {
  args: { href: '/login', icon: 'login', children: 'Login' },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: /login/i });
    await expect(link).toHaveAttribute('href', '/login');
  },
};

export const Cadastro: Story = {
  args: { href: '/cadastro', icon: 'person_add', children: 'Cadastro' },
};
