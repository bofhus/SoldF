'use client';

import Link from 'next/link';
import { useReaderStore } from '@/store/reader-store';
import type { ChapterSummaryData } from '@/lib/types';
import { ChapterCard } from '@/components/chapter-card';

export function HomeDashboard({ chapters }: { chapters: ChapterSummaryData[] }) {
  const progress = useReaderStore((state) => state.chapterProgress);
  const lastChapterId = useReaderStore((state) => state.lastChapterId);
  const lastChapter = chapters.find((chapter) => chapter.id === lastChapterId);

  return (
    <div className="space-y-8">
      {lastChapter ? (
        <section className="rounded-[2rem] border border-[color:var(--accent)]/30 bg-[color:var(--surface)] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Fortsätt där du var</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">{lastChapter.title}</h2>
              <p className="mt-2 text-sm text-[color:var(--muted)]">Senast sparad progress: {progress[lastChapter.id]?.progress ?? 0}%.</p>
            </div>
            <Link href={`/reader/${lastChapter.id}`} className="rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-[#0a1206]">
              Öppna läsläge
            </Link>
          </div>
        </section>
      ) : null}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {chapters.map((chapter) => (
          <ChapterCard key={chapter.id} chapter={chapter} progress={progress[chapter.id]?.progress ?? 0} />
        ))}
      </section>
    </div>
  );
}
