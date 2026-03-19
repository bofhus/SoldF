export function ProgressBar({ value }: { value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-[color:var(--muted)]">
        <span>Läsprogress</span>
        <span>{value}%</span>
      </div>
      <div className="h-3 rounded-full bg-black/20">
        <div className="h-3 rounded-full bg-[linear-gradient(90deg,var(--accent),#a4d65e)] transition-all" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
