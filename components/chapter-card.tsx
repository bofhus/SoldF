import Link from 'next/link';
import { ArrowRight, BookOpen, RadioTower } from 'lucide-react';
import type { ChapterSummaryData } from '@/lib/types';

export function ChapterCard({ chapter, progress = 0 }: { chapter: ChapterSummaryData; progress?: number }) {
  return (
    <Link
      href={`/chapter/${chapter.id}`}
      className="group flex h-full flex-col rounded-3xl border border-white/10 bg-[color:var(--surface)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.2)] transition hover:-translate-y-1 hover:border-[color:var(--accent)]"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Kapitel {chapter.chapterNumber}</p>
          <h2 className="mt-2 text-xl font-semibold text-[color:var(--foreground)]">{chapter.title}</h2>
        </div>
        <span className="rounded-2xl bg-[color:var(--surface-strong)] p-3 text-[color:var(--accent)]">
          <BookOpen className="size-5" />
        </span>
      </div>
      <p className="line-clamp-4 text-sm text-[color:var(--muted)]">{chapter.excerpt}</p>
      <div className="mt-5 flex items-center justify-between text-xs text-[color:var(--muted)]">
        <span className="inline-flex items-center gap-2"><RadioTower className="size-4" /> {chapter.sections.length} sektioner</span>
        <span>{progress}% läst</span>
      </div>
      <div className="mt-3 h-2 rounded-full bg-black/20">
        <div className="h-2 rounded-full bg-[color:var(--accent)] transition-all" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--accent)]">
        Öppna kapitel <ArrowRight className="size-4 transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
