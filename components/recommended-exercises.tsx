'use client';

import { useEffect, useState } from 'react';
import { VideoEmbedCard } from '@/components/video-embed-card';

interface Idea {
  title: string;
  prompt: string;
  outcome: string;
}

export function RecommendedExercises({ chapterTitle, sectionTitle, sourceText }: { chapterTitle: string; sectionTitle: string; sourceText: string }) {
  const [ideas, setIdeas] = useState<Idea[]>([]);

  useEffect(() => {
    let active = true;
    fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'video', chapterTitle, sectionTitle, sourceText }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (active) setIdeas(data.ideas ?? []);
      })
      .catch(() => {
        if (active) setIdeas([]);
      });

    return () => {
      active = false;
    };
  }, [chapterTitle, sectionTitle, sourceText]);

  return (
    <section className="space-y-4 rounded-[2rem] border border-white/10 bg-[color:var(--surface)] p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--muted)]">Rekommenderade övningar</p>
        <h2 className="mt-2 text-2xl font-semibold text-[color:var(--foreground)]">Videoidéer och embeds</h2>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {ideas.map((idea) => (
          <VideoEmbedCard key={`${idea.title}-${idea.prompt}`} title={idea.title} prompt={idea.prompt} outcome={idea.outcome} />
        ))}
      </div>
      {!ideas.length ? <p className="text-sm text-[color:var(--muted)]">Hämtar videoidéer eller använder fallback om API-nyckel saknas.</p> : null}
    </section>
  );
}
