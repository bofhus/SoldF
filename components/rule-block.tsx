export function RuleBlock({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-[color:var(--accent)]/50 bg-[color:var(--surface-strong)] p-5 shadow-inner shadow-black/20">
      <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--accent)]">Regel</p>
      <p className="mt-3 whitespace-pre-line text-base font-medium leading-7 text-[color:var(--foreground)]">{text}</p>
    </div>
  );
}
