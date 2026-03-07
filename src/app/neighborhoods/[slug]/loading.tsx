export default function NeighborhoodDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse max-w-5xl">
      <div className="h-4 w-32 rounded bg-bg-tertiary" />
      <div className="h-64 rounded-xl bg-bg-tertiary" />
      <div className="h-24 rounded-xl bg-bg-tertiary" />
      <div className="h-72 rounded-xl bg-bg-tertiary" />
      <div className="h-48 rounded-xl bg-bg-tertiary" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-40 rounded-xl bg-bg-tertiary" />
        <div className="h-40 rounded-xl bg-bg-tertiary" />
      </div>
    </div>
  );
}
