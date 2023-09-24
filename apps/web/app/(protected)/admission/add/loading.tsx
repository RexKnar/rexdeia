const LoadingElement = () => <div className="h-12 w-full bg-slate-100"></div>;

const LoadingSection = () => (
  <section className="mb-6 flex w-full gap-5">
    <LoadingElement />
    <LoadingElement />
    <LoadingElement />
  </section>
);

export default function Loading() {
  return (
    <section className="flex w-full gap-10 p-5">
      <section className="h-64 w-72 animate-pulse rounded-md bg-slate-100"></section>

      <section className="flex w-full flex-col">
        <LoadingSection />
        <LoadingSection />
        <LoadingSection />
        <LoadingSection />
      </section>
    </section>
  );
}
