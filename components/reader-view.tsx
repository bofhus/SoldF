'use client';

import { useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { AIActionPanel } from '@/components/ai-action-panel';
import { ProgressBar } from '@/components/progress-bar';
import { RuleBlock } from '@/components/rule-block';
import { TextBlock } from '@/components/text-block';
import { useReaderProgress } from '@/hooks/use-reader-progress';
import type { ChapterSummaryData } from '@/lib/types';

export function ReaderView({ chapter }: { chapter: ChapterSummaryData }) {
  const { progress, updateProgress, lastSectionId } = useReaderProgress(chapter.id);
  const articleRef = useRef<HTMLElement | null>(null);
  const firstSection = chapter.sections[0];

  useEffect(() => {
    const current = articleRef.current;
    if (!current) return;

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const total = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const nextProgress = (scrollTop / total) * 100;
      const sections = Array.from(current.querySelectorAll<HTMLElement>('[data-section-id]'));
      const activeSection = sections.findLast((section) => section.getBoundingClientRect().top <= 160);
      updateProgress(nextProgress, activeSection?.dataset.sectionId);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [updateProgress]);

  useEffect(() => {
    if (!lastSectionId) return;
    const node = document.querySelector<HTMLElement>(`[data-section-id="${lastSectionId}"]`);
    node?.scrollIntoView({ block: 'start' });
  }, [lastSectionId]);

  const sourceText = useMemo(() => firstSection?.blocks.map((block) => block.text).join('\n\n') ?? chapter.rawText, [chapter.rawText, firstSection]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <article ref={articleRef} className="space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-[color:var(--surface)] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--muted)]">Läsläge</p>
              <h2 className="mt-2 text-3xl font-semibold">{chapter.title}</h2>
            </div>
            <Link href={`/quiz/${chapter.id}`} className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold">
              Gå till quiz
            </Link>
          </div>
          <div className="mt-5"><ProgressBar value={progress} /></div>
        </section>
        {chapter.sections.map((section) => (
          <section key={section.id} data-section-id={section.id} id={section.id} className="rounded-[2rem] border border-white/10 bg-[color:var(--surface)] p-6">
            <h3 className="text-2xl font-semibold">{section.title}</h3>
            <div className="mt-5 space-y-4">
              {section.blocks.map((block) =>
                block.type === 'rule' ? <RuleBlock key={block.id} text={block.text} /> : <TextBlock key={block.id} block={block} />,
              )}
            </div>
          </section>
        ))}
      </article>
      <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
        <AIActionPanel chapterTitle={chapter.title} sectionTitle={firstSection?.title ?? chapter.title} sourceText={sourceText} />
        <nav className="rounded-[2rem] border border-white/10 bg-[color:var(--surface)] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Snabbnavigering</p>
          <ul className="mt-4 space-y-3 text-sm">
            {chapter.sections.map((section) => (
              <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  );
}
