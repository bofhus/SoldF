import { HomeDashboard } from '@/components/home-dashboard';
import { getAllChapters, getBookMeta } from '@/lib/data';

export default function HomePage() {
  const chapters = getAllChapters();
  const meta = getBookMeta();

  return (
    <main className="space-y-8">
      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-white/10 bg-[color:var(--surface)] p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--muted)]">Mobil först • PWA redo</p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight">Robust utbildning, anpassad för snabb läsning, övning och repetition.</h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[color:var(--muted)]">
            Utforska {meta.chapterCount} kapitel från {meta.shortTitle}. Plattformen använder originaltexten från JSON-filen som oförändrad källa och kompletterar endast med AI-genererat stödmaterial.
          </p>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-[color:var(--surface)] p-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div><dt className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Kapitelnivå</dt><dd className="mt-2 text-3xl font-semibold">{meta.chapterCount}</dd></div>
            <div><dt className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Offline</dt><dd className="mt-2 text-3xl font-semibold">Aktiverat</dd></div>
            <div><dt className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">AI-funktioner</dt><dd className="mt-2 text-3xl font-semibold">4 lägen</dd></div>
            <div><dt className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Läsläge</dt><dd className="mt-2 text-3xl font-semibold">Progress</dd></div>
          </dl>
        </div>
      </section>
      <HomeDashboard chapters={chapters} />
    </main>
  );
}
