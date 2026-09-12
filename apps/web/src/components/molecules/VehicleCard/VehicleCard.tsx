import Image from 'next/image';

import { Button } from '@/components/atoms';

type VehicleCardProps = {
  imageSrc: string;
  name: string;
  category: string;
  pricePerDay: number;
  onDetailsClick: () => void;
};

const priceFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function VehicleCard({
  imageSrc,
  name,
  category,
  pricePerDay,
  onDetailsClick,
}: VehicleCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm">
      <div className="relative aspect-3/2 w-full overflow-hidden bg-slate-100">
        <Image
          src={imageSrc}
          alt={name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <p className="text-sm text-slate-500">{category}</p>
          <h2 className="font-heading text-xl font-bold text-brand-secondary-pure">{name}</h2>
        </div>

        <div className="mt-auto flex items-end justify-between gap-4">
          <p className="text-sm text-slate-600">
            <strong className="block text-lg text-brand-secondary-pure">
              {priceFormatter.format(pricePerDay)}
            </strong>
            por dia
          </p>
          <Button
            type="button"
            variant="primary"
            onClick={onDetailsClick}
            aria-label={`Ver detalhes de ${name}`}
          >
            Ver detalhes
          </Button>
        </div>
      </div>
    </article>
  );
}

export type { VehicleCardProps };
