'use client';

import { useState } from 'react';
import { BrainCircuit, Clapperboard, FileText, ShieldQuestion } from 'lucide-react';

interface AIActionPanelProps {
  chapterTitle: string;
  sectionTitle: string;
  sourceText: string;
}

type Mode = 'summary' | 'explain' | 'scenario' | 'video';

export function AIActionPanel({ chapterTitle, sectionTitle, sourceText }: AIActionPanelProps) {
  const [loading, setLoading] = useState<Mode | null>(null);
  const [result, setResult] = useState<string | null>(null);

  async function run(mode: Mode) {
    setLoading(mode);
    setResult(null);
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, chapterTitle, sectionTitle, sourceText }),
      });
      const data = await response.json();

      if (mode === 'summary') setResult(data.content);
      if (mode === 'explain') setResult(Array.isArray(data.content) ? data.content.join('\n• ') : data.content);
      if (mode === 'scenario') {
        setResult((data.scenarios ?? []).map((scenario: { title: string; setup: string; focus: string }) => `${scenario.title}\n${scenario.setup}\nFokus: ${scenario.focus}`).join('\n\n'));
      }
      if (mode === 'video') {
        setResult((data.ideas ?? []).map((idea: { title: string; prompt: string; outcome: string }) => `${idea.title}\nPrompt: ${idea.prompt}\nResultat: ${idea.outcome}`).join('\n\n'));
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <aside className="rounded-3xl border border-white/10 bg-[color:var(--surface)] p-5">
      <div className="flex items-center gap-3">
        <span className="rounded-2xl bg-[color:var(--surface-strong)] p-3 text-[color:var(--accent)]"><BrainCircuit className="size-5" /></span>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">AI-stöd</p>
          <h3 className="text-lg font-semibold text-[color:var(--foreground)]">Kompletterande material</h3>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <button type="button" onClick={() => run('summary')} className="rounded-2xl border border-white/10 p-4 hover:border-[color:var(--accent)]">
          <FileText className="mb-2 size-4" /> Sammanfatta
        </button>
        <button type="button" onClick={() => run('explain')} className="rounded-2xl border border-white/10 p-4 hover:border-[color:var(--accent)]">
          <ShieldQuestion className="mb-2 size-4" /> Förklara enklare
        </button>
        <button type="button" onClick={() => run('scenario')} className="rounded-2xl border border-white/10 p-4 hover:border-[color:var(--accent)]">
          <BrainCircuit className="mb-2 size-4" /> Scenario
        </button>
        <button type="button" onClick={() => run('video')} className="rounded-2xl border border-white/10 p-4 hover:border-[color:var(--accent)]">
          <Clapperboard className="mb-2 size-4" /> Videoidéer
        </button>
      </div>
      <p className="mt-4 text-xs text-[color:var(--muted)]">Originaltexten förblir oförändrad. AI skapar endast kompletterande material.</p>
      {loading ? <p className="mt-4 text-sm text-[color:var(--accent)]">Genererar {loading}…</p> : null}
      {result ? <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-black/20 p-4 text-sm leading-7 text-[color:var(--foreground)]">{result}</pre> : null}
    </aside>
  );
}
