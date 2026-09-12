import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';

import { SocialIcon } from './SocialIcon';

const socialLinks = [
  { platform: 'whatsapp', label: 'WhatsApp', href: 'https://www.whatsapp.com/' },
  { platform: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/' },
  { platform: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/' },
] as const;

const meta = {
  component: SocialIcon,
  tags: ['ai-generated'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="rounded-xl bg-brand-secondary-pure p-6">
        <Story />
      </div>
    ),
  ],
  args: {
    platform: 'instagram',
    href: 'https://www.instagram.com/',
  },
} satisfies Meta<typeof SocialIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllPlatforms: Story = {
  render: () => (
    <div className="flex gap-3">
      {socialLinks.map(({ platform, href }) => (
        <SocialIcon href={href} key={platform} platform={platform} />
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    for (const { label, href } of socialLinks) {
      const link = canvas.getByRole('link', { name: `Siga a Hermex no ${label}` });

      await expect(link).toHaveAttribute('href', href);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  },
};
