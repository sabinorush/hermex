import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';

import { Footer } from './Footer';

const socialLinks = [
  { label: 'WhatsApp', href: 'https://www.whatsapp.com/' },
  { label: 'Instagram', href: 'https://www.instagram.com/' },
  { label: 'TikTok', href: 'https://www.tiktok.com/' },
] as const;

const meta = {
  component: Footer,
  tags: ['ai-generated'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    whatsappHref: socialLinks[0].href,
    instagramHref: socialLinks[1].href,
    tiktokHref: socialLinks[2].href,
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText('Hermex')).toBeVisible();
    await expect(
      canvas.getByText('Desenvolvido por Alura. Projeto fictício sem fins comerciais.'),
    ).toBeVisible();
    await expect(canvas.getByText('O carro ideal para sua viagem.')).toBeVisible();

    for (const { label, href } of socialLinks) {
      const link = canvas.getByRole('link', { name: `Siga a Hermex no ${label}` });

      await expect(link).toHaveAttribute('href', href);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }

    const footer = canvasElement.querySelector('footer');
    await expect(footer).not.toBeNull();
    await expect(getComputedStyle(footer as HTMLElement).backgroundColor).toBe('rgb(29, 47, 64)');
    await expect(getComputedStyle(footer as HTMLElement).color).toBe('rgb(255, 255, 255)');
  },
};

export const Mobile: Story = {
  globals: {
    viewport: { value: 'mobile1', isRotated: false },
  },
};
