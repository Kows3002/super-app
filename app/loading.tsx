function Block({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-white/10 ${className}`} />;
}

export default function Loading() {
  return (
    <main className="min-h-screen bg-black px-6 py-6 text-white md:px-10 lg:px-12">
      <header className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
        <Block className="h-9 w-32" />
        <Block className="h-9 w-44 rounded-full" />
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="flex flex-col gap-4">
          <Block className="h-36" />
          <Block className="h-44" />
          <Block className="h-60" />
        </section>

        <section className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
          <Block className="h-48 rounded-none" />
          <div className="space-y-3 p-4">
            <Block className="h-7 w-4/5" />
            <Block className="h-4 w-1/3" />
            <Block className="h-4 w-full" />
            <Block className="h-4 w-11/12" />
            <Block className="h-4 w-10/12" />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <Block className="h-72" />
          <Block className="h-16" />
          <Block className="h-12" />
        </section>
      </div>
    </main>
  );
}
