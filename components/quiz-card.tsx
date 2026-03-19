'use client';

import { useState } from 'react';

interface QuizCardProps {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export function QuizCard({ question, options, correctIndex, explanation }: QuizCardProps) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <article className="rounded-3xl border border-white/10 bg-[color:var(--surface)] p-5">
      <h3 className="text-lg font-semibold text-[color:var(--foreground)]">{question}</h3>
      <div className="mt-4 grid gap-3">
        {options.map((option, index) => {
          const isSelected = selected === index;
          const isCorrect = index === correctIndex;
          return (
            <button
              key={`${question}-${index}`}
              type="button"
              onClick={() => setSelected(index)}
              className={`rounded-2xl border p-4 text-left text-sm transition ${
                selected === null
                  ? 'border-white/10 hover:border-[color:var(--accent)]'
                  : isCorrect
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : isSelected
                      ? 'border-rose-500 bg-rose-500/10'
                      : 'border-white/10 opacity-70'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {selected !== null ? (
        <p className="mt-4 text-sm text-[color:var(--muted)]">
          {selected === correctIndex ? 'Rätt svar.' : 'Fel svar.'} {explanation}
        </p>
      ) : null}
    </article>
  );
}
