import { Footer, Header, HeroBanner } from '@/components/organisms';

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      <Header />
      <main className="flex-1">
        <HeroBanner />
        <section className="w-full bg-slate-50 px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 h-10 w-64 animate-pulse rounded-lg bg-slate-200" />

            <div
              data-testid="vehicle-grid-skeleton"
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm"
                >
                  <div className="aspect-3/2 w-full animate-pulse bg-slate-200" />
                  <div className="flex flex-1 flex-col gap-4 p-5">
                    <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                    <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
                    <div className="mt-auto flex items-end justify-between gap-4 pt-4">
                      <div className="h-8 w-20 animate-pulse rounded bg-slate-200" />
                      <div className="h-10 w-28 animate-pulse rounded bg-slate-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
