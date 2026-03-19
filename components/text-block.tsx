import clsx from 'clsx';
import type { ContentBlock } from '@/lib/types';

export function TextBlock({ block }: { block: ContentBlock }) {
  const lines = block.text.split('\n').filter(Boolean);

  if (block.type === 'list') {
    return (
      <ul className="space-y-2 rounded-2xl bg-black/10 p-4 text-sm leading-7 text-[color:var(--foreground)]">
        {lines.map((line) => (
          <li key={line} className="flex gap-3">
            <span className="mt-2 size-2 rounded-full bg-[color:var(--accent)]" />
            <span>{line.replace(/^[•\-*]\s*/, '')}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p
      className={clsx('text-base leading-8 text-[color:var(--foreground)]', {
        'rounded-2xl border border-[color:var(--accent)]/40 bg-[color:var(--surface-strong)] p-4 font-medium': block.type === 'rule',
      })}
    >
      {block.text}
    </p>
  );
}
