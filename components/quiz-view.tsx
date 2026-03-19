'use client';

import { useEffect, useState } from 'react';
import { QuizCard } from '@/components/quiz-card';
import type { ChapterSummaryData } from '@/lib/types';

interface QuizPayload {
  questions: Array<{
    id?: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
  }>;
}

export function QuizView({ chapter }: { chapter: ChapterSummaryData }) {
  const [payload, setPayload] = useState<QuizPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const section = chapter.sections[0];

  useEffect(() => {
    let active = true;
    fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'quiz',
        chapterTitle: chapter.title,
        sectionTitle: section?.title ?? chapter.title,
        sourceText: section?.blocks.map((block) => block.text).join('\n\n') ?? chapter.rawText,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (active) setPayload(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [chapter.rawText, chapter.title, section]);

  return (
    <main className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-[color:var(--surface)] p-6">
        <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--muted)]">Quiz</p>
        <h2 className="mt-2 text-3xl font-semibold">{chapter.title}</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">Frågorna genereras som kompletterande material utifrån kapiteltexten. Originaltexten används som källa och ändras inte.</p>
      </section>
      {loading ? <div className="rounded-[2rem] border border-white/10 bg-[color:var(--surface)] p-6 text-sm">Genererar frågor…</div> : null}
      <section className="grid gap-4">
        {payload?.questions?.map((question, index) => (
          <QuizCard
            key={question.id ?? `${question.question}-${index}`}
            question={question.question}
            options={question.options}
            correctIndex={question.correctIndex}
            explanation={question.explanation}
          />
        ))}
      </section>
    </main>
  );
}
