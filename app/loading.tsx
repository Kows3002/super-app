import Skeleton from 'react-loading-skeleton';

export default function Loading() {
  return (
    <main className="min-h-screen bg-black px-6 py-6 text-white md:px-10 lg:px-12">
      <header className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
        <Skeleton width={120} height={36} />
        <Skeleton width={170} height={36} borderRadius={999} />
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="flex flex-col gap-4">
          <Skeleton height={150} borderRadius={16} />
          <Skeleton height={190} borderRadius={16} />
          <Skeleton height={250} borderRadius={16} />
        </section>

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-surface">
          <Skeleton height={190} borderRadius={0} />
          <div className="p-4">
            <Skeleton width="80%" height={28} />
            <Skeleton width="35%" height={14} className="mt-2" />
            <Skeleton count={5} className="mt-3" />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <Skeleton height={300} borderRadius={16} />
          <Skeleton height={72} borderRadius={16} />
          <Skeleton height={48} borderRadius={16} />
        </section>
      </div>
    </main>
  );
}
