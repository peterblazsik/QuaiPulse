export default function CompareLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-4 w-32 rounded bg-bg-tertiary" />
      <div className="h-8 w-64 rounded bg-bg-tertiary" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-56 rounded-xl bg-bg-tertiary" />
        <div className="h-56 rounded-xl bg-bg-tertiary" />
      </div>
      <div className="h-80 rounded-xl bg-bg-tertiary" />
      <div className="h-48 rounded-xl bg-bg-tertiary" />
    </div>
  );
}
