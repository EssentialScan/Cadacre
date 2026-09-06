export function WatchBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="inline-flex min-w-[1.15rem] items-center justify-center rounded-full bg-survey-brass px-1 py-0.5 font-mono-figure text-[10px] font-semibold leading-none text-parchment">
      {count}
    </span>
  );
}
