import Image from 'next/image';

export function HeroBanner() {
  return (
    <section className="relative w-full bg-brand-secondary-dark bg-[url('/hero/hero-stripes.svg')] bg-[length:1112px_642px] bg-left-top bg-no-repeat">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 pt-16 pb-32 sm:flex-row sm:justify-between sm:gap-6 sm:px-6 sm:pt-20 sm:pb-40 lg:pb-48">
        <h1 className="max-w-xl font-heading text-4xl leading-tight font-bold text-white sm:text-5xl lg:text-[76px] lg:leading-[1.25]">
          <span className="text-brand-primary-pure">
            Encontre o carro <em className="italic">ideal</em>
          </span>{' '}
          para todas as ocasiões
        </h1>

        <div className="relative w-full max-w-md shrink-0 sm:w-1/2 sm:max-w-none">
          <div className="relative aspect-3/2 w-full overflow-hidden rounded-2xl sm:h-[420px] sm:aspect-auto">
            <Image
              src="/hero/hero-woman.png"
              alt="Mulher sorrindo dirigindo um carro"
              fill
              priority
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <Image
            src="/hero/chevron-large.svg"
            alt=""
            aria-hidden
            width={64}
            height={64}
            className="absolute -top-4 -right-2 hidden sm:block"
          />
          <Image
            src="/hero/chevron-small.svg"
            alt=""
            aria-hidden
            width={39}
            height={39}
            className="absolute top-20 right-20 hidden rotate-180 sm:block"
          />
        </div>
      </div>
    </section>
  );
}
