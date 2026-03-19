interface VideoEmbedCardProps {
  title: string;
  prompt: string;
  outcome: string;
  embedUrl?: string;
}

export function VideoEmbedCard({ title, prompt, outcome, embedUrl }: VideoEmbedCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-[color:var(--surface)] p-5">
      <div className="aspect-video overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(149,195,91,0.18),rgba(0,0,0,0.18))]">
        {embedUrl ? (
          <iframe src={embedUrl} title={title} className="h-full w-full" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center text-sm text-[color:var(--muted)]">
            Placeholder för video/embed. Använd prompten nedan för att generera eller bädda in utbildningsvideo.
          </div>
        )}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[color:var(--foreground)]">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">Prompt: {prompt}</p>
      <p className="mt-2 text-sm leading-7 text-[color:var(--foreground)]">Mål: {outcome}</p>
    </article>
  );
}
