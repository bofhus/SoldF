import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AIActionPanel } from '@/components/ai-action-panel';
import { RecommendedExercises } from '@/components/recommended-exercises';
import { RuleBlock } from '@/components/rule-block';
import { TextBlock } from '@/components/text-block';
import { getAdjacentChapter, getChapterById } from '@/lib/data';

export default async function ChapterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chapter = getChapterById(id);

  if (!chapter) notFound();

  const adjacent = getAdjacentChapter(id);
  const firstSection = chapter.sections[0];

  return (
    <main className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="space-y-6">
        <div className="rounded-[2rem] border border-white/10 bg-[color:var(--surface)] p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--muted)]">Kapitel {chapter.chapterNumber}</p>
          <h2 className="mt-3 text-3xl font-semibold">{chapter.title}</h2>
          <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">Boksidor {chapter.bookPageRange} • PDF-sidor {chapter.pdfPageRange}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/reader/${chapter.id}`} className="rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-[#0a1206]">Öppna läsläge</Link>
            <Link href={`/quiz/${chapter.id}`} className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold">Starta quiz</Link>
          </div>
        </div>

        <RecommendedExercises chapterTitle={chapter.title} sectionTitle={firstSection?.title ?? chapter.title} sourceText={firstSection?.blocks.map((block) => block.text).join('\n\n') ?? chapter.rawText} />

        <div className="space-y-6">
          {chapter.sections.map((section) => (
            <article key={section.id} id={section.id} className="rounded-[2rem] border border-white/10 bg-[color:var(--surface)] p-6">
              <h3 className="text-2xl font-semibold">{section.title}</h3>
              <div className="mt-5 space-y-4">
                {section.blocks.map((block) =>
                  block.type === 'rule' ? <RuleBlock key={block.id} text={block.text} /> : <TextBlock key={block.id} block={block} />,
                )}
              </div>
            </article>
          ))}
        </div>

        <nav className="flex items-center justify-between rounded-[2rem] border border-white/10 bg-[color:var(--surface)] p-6 text-sm">
          {adjacent.previous ? <Link href={`/chapter/${adjacent.previous.id}`}>← {adjacent.previous.title}</Link> : <span />}
          {adjacent.next ? <Link href={`/chapter/${adjacent.next.id}`}>{adjacent.next.title} →</Link> : null}
        </nav>
      </section>

      <section className="space-y-6 lg:sticky lg:top-6 lg:self-start">
        <AIActionPanel chapterTitle={chapter.title} sectionTitle={firstSection?.title ?? chapter.title} sourceText={firstSection?.blocks.map((block) => block.text).join('\n\n') ?? chapter.rawText} />
        <div className="rounded-[2rem] border border-white/10 bg-[color:var(--surface)] p-6">
          <h3 className="text-lg font-semibold">Sektioner</h3>
          <ul className="mt-4 space-y-3 text-sm text-[color:var(--muted)]">
            {chapter.sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
