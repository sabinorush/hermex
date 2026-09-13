import { Logo, SocialIcon } from '@/components/atoms';

type FooterProps = {
  whatsappHref: string;
  instagramHref: string;
  tiktokHref: string;
};

export function Footer({ whatsappHref, instagramHref, tiktokHref }: FooterProps) {
  return (
    <footer className="w-full bg-brand-secondary-pure text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 md:flex-row md:items-end md:justify-between md:py-12">
        <div className="flex max-w-md flex-col items-start gap-4">
          <Logo variant="inverted" />
          <div className="space-y-1 text-sm leading-6">
            <p>Desenvolvido por Alura. Projeto fictício sem fins comerciais.</p>
            <p>O carro ideal para sua viagem.</p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <p className="text-sm font-medium">Siga nossas redes:</p>
          <div className="flex gap-3">
            <SocialIcon href={whatsappHref} platform="whatsapp" />
            <SocialIcon href={instagramHref} platform="instagram" />
            <SocialIcon href={tiktokHref} platform="tiktok" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export type { FooterProps };
